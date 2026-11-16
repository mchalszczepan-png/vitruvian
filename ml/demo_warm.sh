#!/bin/sh
# Keep the Modal LoRA server ready for a demo. A cold start takes ~13 min (vLLM load).
#
#   ml/demo_warm.sh ping   # wake it and wait until /v1/models answers (run 15 min before the demo)
#   ml/demo_warm.sh on     # keep 1 container always up (~$2.50/h on A100-80GB) for the judging window
#   ml/demo_warm.sh off    # back to scale-to-zero
#
# Env: VITRUVIAN_KEY_FILE (default ~/.config/vitruvian/lora-api-key), MODAL_ENVIRONMENT (default vitruvian).
set -eu

URL="https://mchalszczepan-png-vitruvian--vitruvian-serve-serve.us-east.modal.run/v1/models"
KEY_FILE="${VITRUVIAN_KEY_FILE:-$HOME/.config/vitruvian/lora-api-key}"
export MODAL_ENVIRONMENT="${MODAL_ENVIRONMENT:-vitruvian}"

autoscale() {
    uv run --quiet --with modal python -c "
import modal, sys
modal.Function.from_name('vitruvian-serve', 'serve').autoscaler.update(min_containers=int(sys.argv[1]))
print('min_containers =', sys.argv[1])" "$1"
}

case "${1:-}" in
ping)
    # Modal answers 303 after 150 s while the container starts; -L follows it. Retry up to ~25 min.
    i=0
    while [ "$i" -lt 8 ]; do
        code=$(curl -sL -m 300 -o /dev/null -w '%{http_code}' -H "Authorization: Bearer $(cat "$KEY_FILE")" "$URL" || true)
        echo "$(date +%T) HTTP $code"
        [ "$code" = 200 ] && exit 0
        i=$((i + 1))
        sleep 15
    done
    echo "server did not come up" >&2
    exit 1
    ;;
on) autoscale 1 ;;
off) autoscale 0 ;;
*)
    echo "usage: $0 ping|on|off" >&2
    exit 2
    ;;
esac
