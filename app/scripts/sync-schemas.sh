#!/bin/sh
# Copies the referral JSON Schemas from ml/schemas/ into app/convex/model/schemas/ so Convex can import them.
# Read-only on ml/. The copy is verified byte for byte by app/convex/model/prompt.test.ts.
# Research prototype. Not a medical device. Not for clinical use.
set -eu
here=$(cd "$(dirname "$0")" && pwd)
src="$here/../../ml/schemas"
dst="$here/../convex/model/schemas"
mkdir -p "$dst"
for cancer in lung colorectal ovarian; do
  cp "$src/$cancer.json" "$dst/$cancer.json"
done
echo "synced 3 schemas to $dst"
