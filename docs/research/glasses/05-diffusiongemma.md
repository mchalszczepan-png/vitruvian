# 05 — DiffusionGemma: can we run it for a ~30-token nudge?

Research date: 2026-11-14. Scope: repo id, VRAM, serving, hosts (Featherless, Modal, Verda), latency, cold start, Gemma-track fit, fallback.

Method: primary pages fetched with WebFetch (the context.dev MCP was rate-limited during the sweep, so I switched to WebFetch/WebSearch as instructed). Items marked **UNVERIFIED** were seen only in a search snippet, a third-party page, or are my own arithmetic/estimate.

Terms: **HF** = Hugging Face. **BF16/FP8** = number formats. **canvas** = the 256-token block DiffusionGemma denoises at once.

---

## 1. Answers at a glance

| Question | Answer | Source |
| --- | --- | --- |
| Exact HF repo id | `google/diffusiongemma-26B-A4B-it` | [HF model card](https://huggingface.co/google/diffusiongemma-26B-A4B-it) |
| Release date | 2026-06-10 | [Google developer guide](https://developers.googleblog.com/en/diffusiongemma-the-developer-guide/) (post date); [Google blog](https://blog.google/innovation-and-ai/technology/developers-tools/diffusion-gemma-faster-text-generation/) (byline) |
| License | Apache 2.0 | [HF model card](https://huggingface.co/google/diffusiongemma-26B-A4B-it) |
| Base | "26B A4B Mixture-of-Experts Gemma 4 base" | [HF model card](https://huggingface.co/google/diffusiongemma-26B-A4B-it) |
| Size | 25.2B total, 3.8B active (card table); "26B" in headers | [HF model card](https://huggingface.co/google/diffusiongemma-26B-A4B-it) |
| Inputs / output | Input text + image (card table; card prose also mentions video). Output text. | [HF model card](https://huggingface.co/google/diffusiongemma-26B-A4B-it) |
| Context | Up to 256K tokens | [HF model card](https://huggingface.co/google/diffusiongemma-26B-A4B-it) |
| VRAM | Min **1× 80 GB GPU in BF16** (vLLM recipe). Google says it fits in **18 GB when quantized**. | [vLLM recipe](https://docs.vllm.ai/projects/recipes/en/latest/Google/Gemma4.html); [Google blog](https://blog.google/innovation-and-ai/technology/developers-tools/diffusion-gemma-faster-text-generation/) |
| Serving | vLLM (documented), SGLang, Transformers, Docker Model Runner; quantized GGUF builds for llama.cpp / Ollama / LM Studio | [HF model card](https://huggingface.co/google/diffusiongemma-26B-A4B-it), [vLLM recipe](https://docs.vllm.ai/projects/recipes/en/latest/Google/Gemma4.html) |
| Featherless | **Not found** (checked page 1 of its Gemma search; it lists `google/gemma-4-26B-A4B-it` but no DiffusionGemma) | [Featherless search](https://featherless.ai/models?search=gemma) |
| Modal | No DiffusionGemma recipe found. Adaptable vLLM Modal script exists. | [vLLM Modal script](https://docs.vllm.ai/projects/recipes/en/stable/Google/gemma4-modal.py) (UNVERIFIED: seen in search snippet, not fetched) |
| Verda | **Not in its inference catalog**. Only a GPU VM route (run vLLM yourself). | [Verda model catalog](https://docs.verda.com/inference/models/) |
| Latency, ~30 tokens | No published number. Our estimate: **~0.6 s p50 warm on H100** (UNVERIFIED, measure it). | Section 5 |
| Cold start | Container boot ~1 s (Modal). Weight load is the real cost: **minutes, UNVERIFIED**. Mitigate with a cached volume + `min_containers=1`. | [Modal cold-start doc](https://modal.com/docs/guide/cold-start) |
| Qualifies for Gemma track? | **Probably yes** (Google, "Gemma"-branded, Gemma 4 base, Apache 2.0). Judge acceptance **UNVERIFIED**, ask organisers in writing. | [Gemma track brief](../../tracks/google-deepmind-gemma.md) (local file) |

**Correction to our own docs (corrected 2026-11-14).** Our earlier note said our docs call DiffusionGemma text-only. Checked again: `docs/README.md` line 19 already says text + image input, which matches the HF card, and `docs/research/glasses/emulation/03-sdk-samples-sweep.md` does not mention DiffusionGemma, so nothing there needs fixing. The HF card lists text **and** image input (text output). Our design is unchanged, because the nudge writer receives text only. Sources: [HF model card](https://huggingface.co/google/diffusiongemma-26B-A4B-it); [docs/README.md](../../README.md) (local file).

**Quality is lower than Gemma 4.** Google says "overall output quality is lower than standard Gemma 4" and recommends standard Gemma 4 for maximum quality ([Google blog](https://blog.google/innovation-and-ai/technology/developers-tools/diffusion-gemma-faster-text-generation/)). Card benchmarks, DiffusionGemma vs Gemma 4 26B-A4B (from the [HF model card](https://huggingface.co/google/diffusiongemma-26B-A4B-it)):

| Benchmark | DiffusionGemma | Gemma 4 26B-A4B |
| --- | --- | --- |
| MMLU Pro | 77.6% | 82.6% |
| GPQA Diamond | 73.2% | 82.3% |
| MMMU Pro | 54.3% | 73.8% |
| HLE, no tools | **11.0%** | 8.7% |

DiffusionGemma leads only on HLE without tools. For a 1-sentence tip the gap matters less than the speed, but the nudge must be checked for accuracy (see the risks in `08-architecture-plan.md`).

---

## 2. Exact repo id and what it is

- Repo: **`google/diffusiongemma-26B-A4B-it`** ([HF model card](https://huggingface.co/google/diffusiongemma-26B-A4B-it)).
- Transformers class: `DiffusionGemmaForBlockDiffusion` with `AutoProcessor`. `use_cache` is not accepted; the model always uses a KV cache ([HF Transformers doc](https://huggingface.co/docs/transformers/v5.14.0/model_doc/diffusion_gemma.md)).
- HF says **Diffusers is the primary home**; the Transformers implementation gets only bug fixes ([HF Transformers doc](https://huggingface.co/docs/transformers/v5.14.0/model_doc/diffusion_gemma.md)).
- Architecture: encoder-decoder. Each canvas (256 tokens) is denoised as a block, then appended to the KV cache, then the next canvas is generated ([HF Transformers doc](https://huggingface.co/docs/transformers/v5.14.0/model_doc/diffusion_gemma.md)).
- Card-listed decoding: canvas length 256, max 48 denoising steps, entropy-bound sampler, **15–20 tokens per forward pass** ([HF model card](https://huggingface.co/google/diffusiongemma-26B-A4B-it)).

Why this matters for us: a canvas is always 256 positions, so a 30-token nudge still costs at least one full canvas of denoising. Latency is driven by the canvas, not by the number of output tokens.

---

## 3. VRAM

- **vLLM recipe (strongest source):** minimum 1× NVIDIA GPU with **80 GB (BF16)**. AMD: 1× MI300X/MI325X/MI350X/MI355X ([vLLM recipe](https://docs.vllm.ai/projects/recipes/en/latest/Google/Gemma4.html)).
- **Google blog:** "fits within 18GB VRAM when quantized" ([Google blog](https://blog.google/innovation-and-ai/technology/developers-tools/diffusion-gemma-faster-text-generation/)). The developer guide also says 18 GB for quantized deployment ([Google developer guide](https://developers.googleblog.com/en/diffusiongemma-the-developer-guide/)).
- **Our arithmetic (UNVERIFIED):** 25.2B params × 2 bytes (BF16) ≈ 50 GB of weights before KV cache and activations. This fits the 80 GB minimum.
- **Third-party guide (UNVERIFIED, not Google):** ~56 GB at FP16, ~28 GB at INT8, ~14 GB at INT4 ([Spheron GPU guide](https://www.spheron.network/tools/gpu-recommender/google/diffusiongemma-26B-A4B-it/) (search snippet only)).

**Practical rule for us:** plan for **one 80 GB GPU in BF16 (H100 or A100 80GB)**. Google says a quantized build fits in 18 GB ([Google blog](https://blog.google/innovation-and-ai/technology/developers-tools/diffusion-gemma-faster-text-generation/)), so a 24–32 GB consumer GPU may work. This is unproven in our stack (our reading).

---

## 4. Serving

### 4a. vLLM (best supported path)

Google's developer guide gives this command ([Google developer guide](https://developers.googleblog.com/en/diffusiongemma-the-developer-guide/), June 10, 2026):

```bash
vllm serve google/diffusiongemma-26B-A4B-it \
  --max-model-len 262144 \
  --max-num-seqs 4 \
  --gpu-memory-utilization 0.85 \
  --attention-backend TRITON_ATTN \
  --generation-config vllm \
  --hf-overrides '{"diffusion_sampler": "entropy_bound", "diffusion_entropy_bound": 0.1}' \
  --diffusion-config '{"canvas_length": 256}' \
  --enable-chunked-prefill
```

Docker form and required flags from the vLLM recipe ([vLLM recipe](https://docs.vllm.ai/projects/recipes/en/latest/Google/Gemma4.html)):
- Image: `vllm/vllm-openai:gemma`.
- `--max-num-seqs` must stay **≤ 4**; higher values cause OOM because the diffusion buffers pre-allocate memory.
- `--generation-config vllm` is required, otherwise the checkpoint's `generation_config.json` caps `max_tokens` at 256.
- Dedicated recipe: https://recipes.vllm.ai/Google/diffusiongemma-26B-A4B-it (linked from the vLLM recipe; not fetched).

**Our tweak (UNVERIFIED):** lower `--max-model-len` (e.g. 8192) to cut KV memory. Our demo prompts are short. Test it; do not assume.

The server is OpenAI-compatible (`/v1/chat/completions`), so the backend can call it with a plain HTTP client ([vLLM recipe](https://docs.vllm.ai/projects/recipes/en/latest/Google/Gemma4.html)).

### 4b. Transformers (fallback for debugging only)

```python
from transformers import DiffusionGemmaForBlockDiffusion, AutoProcessor
model = DiffusionGemmaForBlockDiffusion.from_pretrained("google/diffusiongemma-26B-A4B-it", device_map="auto")
# output = model.generate(**inputs, max_new_tokens=256)
```
Source: [HF Transformers doc](https://huggingface.co/docs/transformers/v5.14.0/model_doc/diffusion_gemma.md). Good for a notebook check, slower to deploy than vLLM.

### 4c. Gemma 4 26B-A4B in vLLM (for the fallback)

From the vLLM recipe: `vllm serve google/gemma-4-26B-A4B-it --max-model-len 32768 --gpu-memory-utilization 0.90` on 1× 80 GB BF16 GPU ([vLLM recipe](https://docs.vllm.ai/projects/recipes/en/latest/Google/Gemma4.html)).

---

## 5. Hosts: Featherless, Modal, Verda

### Featherless
- Search `featherless.ai/models?search=gemma`, page 1 of 42 results: includes **`google/gemma-4-26B-A4B-it`**. No DiffusionGemma or "diffusion" model appears ([Featherless search](https://featherless.ai/models?search=gemma)).
- The catalog lists 53,635 models (count shown on that page, fetched 2026-11-14); we checked only page 1. **Verdict: not hosted, as far as we can see (UNVERIFIED for the full catalog).**
- Use Featherless only as the Gemma 4 fallback. It is in the sponsor pack: $50 credits via Junction coupon ([docs/sponsors.md](../../sponsors.md) (local file)).

### Modal
- No official DiffusionGemma recipe found.
- Closest: a vLLM-on-Modal script for Gemma 4 (single H200, HF cache volume, web endpoint, `vllm==0.19.0`). Swap the model id and flags. Version pin seen only in a search snippet, UNVERIFIED ([vLLM Modal script](https://docs.vllm.ai/projects/recipes/en/stable/Google/gemma4-modal.py)).
- Modal prices (page undated, "© Modal 2026"), per second as listed ([Modal pricing](https://modal.com/pricing)):

| GPU | $/s | ≈ $/h (our × 3600) | Fits BF16 DiffusionGemma (80 GB)? |
| --- | --- | --- | --- |
| H100 SXM | 0.001097 | 3.95 | Yes |
| A100 80 GB | 0.000694 | 2.50 | Yes |
| B200 | 0.001736 | 6.25 | Yes (overkill) |
| L40S | 0.000542 | 1.95 | No (48 GB per [NVIDIA](https://www.nvidia.com/en-eu/data-center/l40s.md); needs quantized build, UNVERIFIED) |

- Modal free credit listed: $100 Team plan, $30 Starter ([Modal pricing](https://modal.com/pricing)). The sponsor pack gives $100 per participant ([docs/sponsors.md](../../sponsors.md)).
- **$100 ≈ 25 H100-hours** (100 / 3.95) at list price.

### Verda
- Inference catalog lists only **Kimi K3.1 Pro** and **DeepSeek V4.1 Flash 1017**. No Gemma, no DiffusionGemma ([Verda model catalog](https://docs.verda.com/inference/models/)).
- Verda does offer dedicated GPU instances ([Verda GPU instances](https://docs.verda.com/cpu-and-gpu-instances/set-up-a-gpu-instance/)). So the route is: rent a GPU VM and run the vLLM command in 4a yourself.
- GPU hourly prices: **not verified**. The pricing page exists ([Verda pricing](https://docs.verda.com/welcome-to-verda/pricing-and-billing/)) but I could not read the numbers.
- Verdict: a backup, not the primary. Our €200 Verda credit ([docs/sponsors.md](../../sponsors.md), local file) is worth more as a GPU VM than as an inference API we cannot use for this model.

### Other leads (not fetched, UNVERIFIED)
- Baseten has a DiffusionGemma docs page: https://docs.baseten.co/examples/models/llm/diffusiongemma
- Hyperstack has a single-H100 vLLM tutorial: https://www.hyperstack.cloud/technical-resources/tutorials/deploy-diffusiongemma-on-cloud-gpus-for-fast-high-throughput-text-generation
- NVIDIA NIM and Gemini Enterprise Agent Platform Model Garden host it too ([Google blog](https://blog.google/innovation-and-ai/technology/developers-tools/diffusion-gemma-faster-text-generation/)). A reviewer tried NIM and hit an 8,192-token default cap ([Decrypt](https://decrypt.co/370706/google-new-open-model-generates-text-diffusiongemma) (search snippet)).

---

## 6. Latency for ~30-token output

**Published numbers:**
- Per-user generation "exceeding 1100 tokens per second in low batch size settings (H100, FP8)" ([HF model card](https://huggingface.co/google/diffusiongemma-26B-A4B-it)).
- "1000+ tokens per second on a single NVIDIA H100" and "700+ on RTX 5090" ([Google blog](https://blog.google/innovation-and-ai/technology/developers-tools/diffusion-gemma-faster-text-generation/)).
- "Up to 4x faster inference on dedicated GPUs"; Apple unified-memory machines "may not see the same acceleration" ([Google blog](https://blog.google/innovation-and-ai/technology/developers-tools/diffusion-gemma-faster-text-generation/)).

**Our reasoning:**
1. The card's speed is quoted for **FP8**. Our vLLM command in 4a does not use FP8, so expect slower (UNVERIFIED how much).
2. A 30-token nudge fills part of one 256-token canvas. At 15–20 tokens per forward pass, that is about 2 passes minimum and probably 2–4 with early stop. Each pass is a forward over the canvas.
3. The 1100 tok/s figure is a long-output throughput number. It does not directly give a 30-token wall time.

**Estimate (UNVERIFIED, must measure in hour 0–6):**
- Warm H100, BF16, 40 max output tokens: **p50 ≈ 0.6 s, p90 ≈ 1.0 s** for the DiffusionGemma call, including prefill of a short prompt.
- Cold: add weight-load time (below).

**Test plan (cheap):** run 50 prompts through `vllm serve`, log wall time, tokens out, and steps. Do this on day 1 before we commit the architecture.

---

## 7. Cold start

- Modal boot: "Containers boot in about one second." Time-to-ready depends on global-scope code and `modal.enter` ([Modal cold-start doc](https://modal.com/docs/guide/cold-start)).
- Large models: the same doc says downloads of "tens of gigabytes" can take minutes; pre-downloading makes boot "seconds" ([Modal cold-start doc](https://modal.com/docs/guide/cold-start)).
- Our weights are ~50 GB BF16 (our arithmetic). **Loading them from HF on every cold start will take minutes (UNVERIFIED).** Mitigation:
  - Put the HF cache on a Modal Volume once (check the Modal volumes docs, not fetched).
  - `min_containers=1` during the demo window. Modal says this avoids cold starts but costs while idle ([Modal cold-start doc](https://modal.com/docs/guide/cold-start)). At $3.95/h for H100, that is ~$24 for 6 hours.
  - `scaledown_window` default is 60 s, max 20 min ([Modal cold-start doc](https://modal.com/docs/guide/cold-start)).

---

## 8. Does it qualify for the Gemma track?

Track brief: "Awarded to the team that shows the most innovative and impactful use of Google's **Gemma open models**" ([Gemma track brief](../../tracks/google-deepmind-gemma.md) (local file, from hackjunction screenshot)).

- For: "DiffusionGemma" is Google-branded and Gemma-named. Its base is "Gemma 4" per the HF card ([HF model card](https://huggingface.co/google/diffusiongemma-26B-A4B-it)). It is Apache 2.0 ([HF model card](https://huggingface.co/google/diffusiongemma-26B-A4B-it)). Google calls it an open model in the blog ([Google blog](https://blog.google/innovation-and-ai/technology/developers-tools/diffusion-gemma-faster-text-generation/)).
- Against / unknown: the judges' wording says "Gemma open models". Whether they count a diffusion variant is **UNVERIFIED**.
- **Recommendation:** count it as Gemma, but ask organisers in writing. Keep Gemma 4 26B-A4B as a one-env-var switch so the track entry survives either answer.

---

## 9. Fallback: `gemma-4-26b-a4b-it` via the Gemini API

- Model id `gemma-4-26b-a4b-it`, hosted on the Gemini API and in Google AI Studio ([Google Gemma on Gemini API doc](https://ai.google.dev/gemma/docs/core/gemma_on_gemini_api?hl=en); id confirmed in search results, UNVERIFIED on the page itself).
- Image input and a thinking setting are documented ([Google Gemma on Gemini API doc](https://ai.google.dev/gemma/docs/core/gemma_on_gemini_api?hl=en) (search snippet)). Set thinking off for the nudge.
- Pricing: **not verified**.
- Other IDs: Vertex AI `gemma-4-26b-a4b-it-maas` ([Google Cloud docs](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/maas/google/gemma-4-26b-a4b-it), ID seen in search result; pricing not verified). OpenRouter `google/gemma-4-26b-a4b-it` ([OpenRouter](https://openrouter.ai/google/gemma-4-26b-a4b-it), ID seen in search result; prices differ across aggregators, UNVERIFIED).
- Second fallback: Featherless `google/gemma-4-26B-A4B-it`, $50 sponsor credit ([docs/sponsors.md](../../sponsors.md), local file).

Gemini API is the simplest fallback because it costs no GPU and the backend already holds a Google key.

---

## 10. Recommendation

1. **Primary:** DiffusionGemma on Modal, 1× H100 80 GB, vLLM with the Google flags in 4a, `min_containers=1` during the demo. Cache weights on a volume.
2. **Fallback 1:** `gemma-4-26b-a4b-it` via the Gemini API (env switch, no GPU).
3. **Fallback 2:** Featherless `google/gemma-4-26B-A4B-it`.
4. **Measure** the latency test in section 6 on day 1 (hours 0–6). If the warm p50 is over ~1.0 s, switch the primary to fallback 1 for the demo.
5. **Ask** organisers whether DiffusionGemma counts for the Gemma track (section 8).

---

## Sources

- [HF model card: google/diffusiongemma-26B-A4B-it](https://huggingface.co/google/diffusiongemma-26B-A4B-it)
- [HF Transformers doc: DiffusionGemma (v5.14.0)](https://huggingface.co/docs/transformers/v5.14.0/model_doc/diffusion_gemma.md)
- [Google developer guide: DiffusionGemma (2026-06-10)](https://developers.googleblog.com/en/diffusiongemma-the-developer-guide/)
- [Google blog: DiffusionGemma 4x faster text generation](https://blog.google/innovation-and-ai/technology/developers-tools/diffusion-gemma-faster-text-generation/)
- [Google AI for Developers: DiffusionGemma overview](https://ai.google.dev/gemma/docs/diffusiongemma)
- [vLLM recipe: Gemma 4 incl. DiffusionGemma](https://docs.vllm.ai/projects/recipes/en/latest/Google/Gemma4.html)
- [vLLM Modal script (Gemma 4)](https://docs.vllm.ai/projects/recipes/en/stable/Google/gemma4-modal.py)
- [Featherless model search: gemma](https://featherless.ai/models?search=gemma)
- [Verda inference model catalog](https://docs.verda.com/inference/models/)
- [Verda GPU instances](https://docs.verda.com/cpu-and-gpu-instances/set-up-a-gpu-instance/)
- [Verda pricing and billing](https://docs.verda.com/welcome-to-verda/pricing-and-billing/) (page not readable for prices)
- [Modal pricing](https://modal.com/pricing)
- [Modal cold-start guide](https://modal.com/docs/guide/cold-start)
- [Google Gemma on the Gemini API](https://ai.google.dev/gemma/docs/core/gemma_on_gemini_api?hl=en)
- [Decrypt: DiffusionGemma (search snippet)](https://decrypt.co/370706/google-new-open-model-generates-text-diffusiongemma)
- [NVIDIA L40S product page (48 GB GDDR6)](https://www.nvidia.com/en-eu/data-center/l40s.md) (search result)
- [Google Cloud Vertex AI: Gemma 4 26B A4B IT](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/maas/google/gemma-4-26b-a4b-it) (search result)
- [OpenRouter: Gemma 4 26B A4B IT](https://openrouter.ai/google/gemma-4-26b-a4b-it) (search result)
- Local: [docs/tracks/google-deepmind-gemma.md](../../tracks/google-deepmind-gemma.md), [docs/sponsors.md](../../sponsors.md)
