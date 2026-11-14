# 01 — Glasses emulation: Meta DAT Android, FrameSource layer, HUD demo

Date: 2026-11-14. Scope: native Kotlin / Jetpack Compose Android app that emulates Meta smart glasses. Must run on Android emulators and real phones, and must use the real phone camera.

Terms: **DAT** = Meta Wearables Device Access Toolkit. **MDK** = Mock Device Kit (`mwdat-mockdevice`). **HFP** = Bluetooth Hands-Free Profile (mic, mono, 8/16 kHz). **A2DP** = Bluetooth media profile (speaker output, high quality). **HUD** = head-up display (the glasses screen mock).

Status tags: **[DOC]** = read in Meta's docs or repo. **[CODE]** = read in the official sample source. **[UNVERIFIED]** = seen only in a snippet, inferred, or not found. Sketches in section 2 are **not compiled**.

Method: Context API was rate-limited (10 units/min) at the start of the run, so I switched to `curl` on Meta's "View as Markdown" endpoints (`wearables-docs/docs-markdown/develop/dat/*.md`), `gh api` on `meta/meta-wearables-dat-android`, and WebFetch for the Android developer pages. The repo moved from `facebook/` to `meta/` (the old name redirects).

---

## 0. TL;DR

1. **DAT streams 2–30 fps at 360×640 / 504×896 / 720×1280 (9:16) over Bluetooth Classic**, and it has in-stream photo capture. It also has beta in-stream PCM mic audio (dev/beta channels only). Speaker output is ordinary A2DP audio routed by Android. **[DOC]**
2. **MDK can feed a video file (`setCameraFeed(Uri)`) or the phone camera (`setCameraFeed(CameraFacing)`) and a still for photo capture (`setCapturedImage(Uri)`).** It cannot be fed arbitrary live frames from our code. So we keep our own `FrameSource` interface and treat DAT/MDK as one implementation. **[DOC][CODE]**
3. **Licence: develop and test use is allowed under the Meta Wearables Developer Terms. Public distribution needs Meta review. Accessing the SDK needs a Developer Account tied to an Organization, so set that up before hackathon day.** The terms also say the SDK is **not a medical device**, which matters for a "cancer-risk" pitch. **[DOC]**
4. **Build order: `PhoneCameraSource` (CameraX, 1 fps, JPEG ≤512 px, dHash dedupe) → `VideoFileSource` (repeatable POV demo) → `StaticImageSource` (tests) → `MetaGlassesSource` (MDK) last.** Audio out is Android `TextToSpeech` through `AudioOut`. The HUD is one Compose composable with a 600×600 aspect, mirroring the Ray-Ban Display component set. Demo runs on a scripted, repeatable clip with a recorded fallback.
5. **Pitch staging: real phone on a chest or head mount in portrait, rear camera forward, mirrored with `scrcpy` and recorded as the backup.** Ship a `demo` mode with scripted results so Gemini latency or Wi-Fi cannot break the 2-minute slot.

---

## 1. Meta DAT Android: what it exposes

### 1.1 Capabilities

| Area | Facts | Source |
| --- | --- | --- |
| Camera stream frame rate | `frameRate` ∈ **{2, 7, 15, 24, 30} fps**. | [DOC] [streaming](https://wearables.developer.meta.com/docs/develop/dat/streaming/) (md: `wearables-docs/docs-markdown/develop/dat/streaming.md`) |
| Camera stream resolution | Android `VideoQuality`: **HIGH 720×1280, MEDIUM 504×896, LOW 360×640** (9:16 portrait). Limited by Bluetooth Classic. The SDK steps resolution down first, then fps (never below 15 fps) when bandwidth drops. Frames are compressed per frame, so quality can look lower than the label. | [DOC] streaming |
| Frame format | Default `compressVideo = false`: the SDK decodes on the phone and `VideoFrame.buffer` holds **YUV pixel data**. `compressVideo = true` gives HEVC (H.265) buffers. Read the real `width`/`height` from each frame (a frame can be smaller than requested). Pixel-plane layout is **not documented [UNVERIFIED]**. | [DOC] [camera-stream-processing](https://wearables.developer.meta.com/docs/develop/dat/camera-stream-processing/); [CODE] `plugins/mwdat-android/skills/camera-streaming/SKILL.md` |
| Stream processing | Glasses crop to **9:16**, correct lens distortion, stabilise, then HEVC-compress. Stream FOV is narrower than a photo. Intrinsics are not reported. | [DOC] camera-stream-processing |
| Stream states (Android) | `STARTING, STARTED, STREAMING, PAUSED, STOPPING, STOPPED, CLOSED`. Subscribe to `state` **before** `start()`. | [DOC] streaming |
| Photo, in stream | `stream.capturePhoto()` (suspend, returns `PhotoData`). Sample handles `PhotoData.Bitmap` and an encoded `ByteBuffer` (EXIF orientation needed). Keep **one capture in flight**. | [DOC] streaming; [CODE] `CameraViewModel.kt` (`decodePhoto`) |
| Photo, standalone | `camera.photo`, **beta**. Apps using it **cannot be published yet**. Stream and standalone photo **cannot run at the same time**. | [DOC] [camera-capture](https://wearables.developer.meta.com/docs/develop/dat/camera-capture/) |
| Mic, in-stream audio | **Beta**, dev and beta release channels only. Off unless `audioCodec` is set. PCM 16-bit at **16 kHz / 44.1 kHz / 48 kHz**, 1 or more channels. Collect `stream.audioStream`. Keeps output on A2DP. | [DOC] [microphones-and-speakers](https://wearables.developer.meta.com/docs/develop/dat/microphones-and-speakers/) |
| Mic, HFP | Bidirectional, **mono 16 or 8 kHz**, beamformed to the wearer's voice. Switches output off A2DP (drops to voice quality). Android code: `AudioManager.setCommunicationDevice(TYPE_BLUETOOTH_SCO)`, `MODE_IN_COMMUNICATION`. | [DOC] microphones-and-speakers |
| Speaker | No separate DAT speaker API found. Audio output is **A2DP** (high quality). Use normal Android audio routing (TTS, `MediaPlayer`). Android-specific routing details **[UNVERIFIED]**. | [DOC] microphones-and-speakers (A2DP section is iOS-only in the doc) |
| Motion, inputs, device state | Modules exist: `mwdat-motion`, `mwdat-inputs` (touchpad tap / tap-and-hold), device state (battery, wear, thermal). Not needed for v1. | [DOC] repo README artifacts list |
| Display (HUD) | `mwdat-display`. Targets **Meta Ray-Ban Display** only. **600×600** surface. Components: `FlexBox`, `Text` (HEADING/BODY/META, PRIMARY/SECONDARY), `Image` (URL), `Button`, `Icon`, `Video` (MP4, under 400 px per side and 70,000 px total). `sendContent {}` **replaces the whole view**; one display per session; display dims at 20 s and sleeps at 25 s. | [DOC] [display-overview](https://wearables.developer.meta.com/docs/develop/dat/display-overview/), [display-android](https://wearables.developer.meta.com/docs/develop/dat/display-android/) |

### 1.2 Session lifecycle (what the code must do)

Order matters. **[DOC] build-integration-android, lifecycle-events, streaming**

1. `Wearables.initialize(context)`. Call once per process. A second call fails with `ALREADY_INITIALIZED`.
2. `Wearables.startRegistration(activity)` (or `startUnregistration`). Observe `Wearables.registrationState` and `Wearables.devices`.
3. Permission: `Wearables.checkPermissionStatus(Permission.CAMERA)`. If not granted, `RequestPermissionContract` via the Meta AI app.
4. `Wearables.createSession(AutoDeviceSelector())` → `DeviceSession`. Collect `session.state` and `session.errors` **before** `session.start()`.
5. Wait for `DeviceSessionState.STARTED`, then `session.addCamera(StreamConfiguration(...))` → `camera.stream`.
6. Collect `stream.videoStream` (and `stream.state`), then `stream.start()`.
7. Teardown: `camera.stop()` (sample does this), then `session.stop()`.

Rules from the docs:
- `DeviceSessionState`: `STOPPED` (free resources), `STARTED` (live), `PAUSED` (hold work, do not restart). No reason is given.
- **A stopped session cannot restart.** Create a new one and a new camera.
- Folding the glasses forces `STOPPED`. Unfolding does not restart the session.
- Touchpad tap during a stream toggles pause/resume (in MDK, a tap simulates this).

Manifest and Gradle: `com.meta.wearable.mwdat.APPLICATION_ID` and `CLIENT_TOKEN` are required metadata. Use **`0` for both in Developer Mode**. Deps: `com.meta.wearable:mwdat-core`, `mwdat-camera`, `mwdat-mockdevice` (and `mwdat-display` for HUD), all from Maven Central, version **1.0.1** per the earlier sweep [03-sdk-samples-sweep.md]. Manifest also needs `BLUETOOTH`, `BLUETOOTH_CONNECT`, `INTERNET`, `CAMERA` (for the phone-camera mock). **[DOC]**

### 1.3 MockDeviceKit: what it does and whether it can feed our video or images

**What it simulates:** the whole SDK stack, including registration and permission requests, plus pairing, power, don/doff, fold/unfold, camera stream, photo capture, and touchpad taps. Up to **three** mock devices. Glasses models: `GlassesModel.RAYBAN_META`, `GlassesModel.META_RAYBAN_DISPLAY`. **[DOC] mock-device-kit, testing-mdk-android; [CODE] MockDeviceKitViewModel.kt**

**Setup in code [DOC][CODE]:**
```kotlin
val mdk = MockDeviceKit.getInstance(context.applicationContext)
mdk.enable()                                   // or enable(MockDeviceKitConfig(initiallyRegistered = false))
val device = mdk.pairGlasses(GlassesModel.RAYBAN_META).getOrThrow()
device.powerOn(); device.don(); device.unfold() // must be powered on and donned before streaming
device.services.camera.setCameraFeed(uri)      // file URI, streamed when videoStream is active
device.services.camera.setCapturedImage(uri)   // returned by capturePhoto()
```

**Feed options:**

| Feed | API | Constraints | Fit for us |
| --- | --- | --- | --- |
| Video file | `camera.setCameraFeed(Uri)` | Android: **H.265 (HEVC) required** per testing doc. The Android sample does **not** transcode. The plugin skill says H.264 and H.265 are supported. **Conflict; use H.265.** `ffmpeg -i in.mp4 -c:v hevc_videotoolbox -tag:v hvc1 -vf scale=540:960 out.mov` (macOS encoder; use `libx265` on Linux). | **Best for repeatable demos.** |
| Phone camera | `camera.setCameraFeed(CameraFacing)` | Needs `android.permission.CAMERA` granted **before** the call, or the stream start is rejected. Separate from the DAT `Permission.CAMERA`. Photo capture returns a live still. | Works, but it **competes with our own CameraX use of the same camera** (see 1.5). |
| Still image | `camera.setCapturedImage(Uri)` | JPEG or PNG. Returned by `capturePhoto()`. | Good for the photo path. |
| Arbitrary live frames from our code | **Not documented** | - | **Not possible.** Wrap MDK behind our own `FrameSource`. |

Also supported in MDK **[DOC]**: simulated touchpad tap / tap-and-hold, Display preview. For Ray-Ban Display, a **Meta Ray-Ban Display Simulator** Chrome extension and an in-app preview view (600×600). Android port uses `adb forward tcp:9000 tcp:9000`. Public docs do not show a mock microphone or speaker **[UNVERIFIED: not found]**.

Testing on emulators: the docs do not say MDK works on emulators. Its purpose is no-hardware testing, so it should work, but **test it [UNVERIFIED]**. Instrumented tests use `pm grant <pkg> android.permission.CAMERA` and `BLUETOOTH_CONNECT` **[DOC]**.

### 1.4 Licence, terms and hackathon use

Sources: the repo `LICENSE` file is a pointer only ("By using the Wearables Device Access Toolkit, you agree to our Meta Wearables Developer Terms … including our Acceptable Use Policy"). The GitHub API reports the licence as `NOASSERTION`, which matches. Real terms: [Developer Terms](https://wearables.developer.meta.com/terms/) (last updated **2025-10-06**) and [Acceptable Use Policy](https://wearables.developer.meta.com/acceptable-use-policy/) (last updated **2026-09-22**). **[DOC]**

What matters for us:

| Clause | What it means for us |
| --- | --- |
| **Licence scope** (Terms §2): limited, royalty-free, **revocable**, non-transferable. Granted "solely to develop, test, and, if applicable, distribute" an Integration **with Meta Approved Products**. | Building and testing with MDK is inside the grant. Hackathon **demo only** is "develop/test". Publishing an APK or app store listing is "distribute" and needs Meta review (Terms §4). Confirm with organisers whether a judged demo counts as distribution **[UNVERIFIED]**. |
| **Modify the SDK** is banned, except sample apps or sample source "expressly authorized by the documentation". Reverse engineering is banned. | Do not vendor or patch the AAR. Use the samples as reference, but **write our own code** rather than copying `CameraAccess`. |
| **Developer Account + Organization** required to access the Technology (Terms §3). Testers must be invited through the org. | **Create the account and org before the hackathon.** Not checked whether MDK-only use needs it (Terms say "to access the Technology", so assume yes). |
| **Medical and HIPAA** (Terms §2): "not intended to be a medical device unless otherwise specified in writing by Meta". | Important for a **"cancer risk" pitch**. Frame it as **nudges and education, not diagnosis or treatment advice**. Avoid claims like "detects cancer" or "reduces your cancer risk by X%". |
| **AUP: no covert filming; no analysing people in surroundings to facilitate interactions; no surreptitious capture of recognisable audio or video of others.** Also no unique identification by face or voice (exceptions need Meta approval). Sensitive locations are out. | Analyse **the wearer's own food, drink, sun exposure and smoking**, not bystanders. Do not run face detection or recognition. Show a visible **"capturing" indicator** on the HUD (bystander rule: obvious to bystanders). |
| **AUP: "make misrepresentations, including in metadata"** is prohibited. | Pitch honestly: **"emulated glasses, DAT/MDK API, no hardware."** Do not claim an official Meta product. |
| Beta features (in-stream audio, standalone photo) **cannot be published** or are limited to dev/beta channels. | Fine for a hackathon. Do not depend on them in anything meant for release. |

### 1.5 Design consequences

- Our own `PhoneCameraSource` (CameraX) and MDK's phone-camera feed both want the phone camera. **Do not run both at once.** Use MDK with a **video file** for the scripted demo, and CameraX only in the "phone" mode. **[UNVERIFIED: whether they can coexist; avoid the case.]**
- Emulator demo: use the AVD virtual scene camera or a video file. Real phone: CameraX or MDK file feed.
- Speaker: Android routes media to the paired A2DP device. On an emulator there is no Bluetooth, so audio goes to the host or phone speaker.

### 1.6 Corrections to the earlier sweep (03-sdk-samples-sweep.md)

- Sample path is **`samples/CameraAccess`**, not `samples/CameraAccessAndroid`. Repo is now `github.com/meta/meta-wearables-dat-android`. **[DOC][CODE]**
- The sweep's "Android 10+ / Kotlin 2.2+" remains **[UNVERIFIED]**. The sample README requires Android Studio Narwhal 2025.1.1+, JDK 17+, **Android SDK 36**. `minSdk` not confirmed.
- Licence: `NOASSERTION` is correct. The `LICENSE` file only points to the Developer Terms. See 1.4.
- MDK H.265-vs-H.264 conflict is new (1.3).

---

## 2. Kotlin emulation layer

### 2.1 Architecture

```
FrameSource (interface)           emits SceneFrame ≤ ~1 fps, JPEG ≤ 512 px
 ├─ PhoneCameraSource   CameraX ImageAnalysis, back camera, STRATEGY_KEEP_ONLY_LATEST
 ├─ VideoFileSource     MediaMetadataRetriever at 1 fps, loops (POV clip)
 ├─ StaticImageSource   one JPEG/PNG, for tests and screenshots
 └─ MetaGlassesSource   DAT session + in-stream capturePhoto() (or MDK feed)

→ dedupe (dHash, Hamming ≤ 6, heartbeat 10 s)   [Dispatchers.Default]
→ analysis worker (CONFLATED channel, one Gemini call in flight)  [IO]
→ HUD StateFlow → Compose HUD  [Main]
→ AudioOut (TTS) for spoken tips  [Main-safe]
```

Modes in settings: `PHONE_LIVE`, `VIDEO_POV` (default for the pitch), `STATIC_TEST`, `GLASSES_DAT`.

### 2.2 Interfaces and shared helpers

```kotlin
package app.vitruvian.glasses.source

import android.graphics.Bitmap
import android.graphics.Color
import android.graphics.Matrix
import java.io.ByteArrayOutputStream
import kotlinx.coroutines.flow.Flow

enum class Origin { PHONE, VIDEO, STATIC, GLASSES }

/** One analysable frame. jpeg is ≤512 px on the long side, JPEG q=80 (fits Gemini image input). */
class SceneFrame(
    val jpeg: ByteArray,
    val dHash: Long,        // 64-bit difference hash for dedupe
    val tsMs: Long,         // source clock (elapsedRealtime for live, video position for files)
    val origin: Origin,
)

interface FrameSource {
    /** Cold flow. Collecting starts the source; cancelling releases it. Pacing is the source's job. */
    fun frames(): Flow<SceneFrame>
}

fun Bitmap.rotate(degrees: Int): Bitmap =
    if (degrees == 0) this
    else Bitmap.createBitmap(this, 0, 0, width, height, Matrix().apply { postRotate(degrees.toFloat()) }, true)

fun Bitmap.downscale(maxSide: Int): Bitmap {
    val s = maxSide / maxOf(width, height).toFloat()
    return if (s >= 1f) this else Bitmap.createScaledBitmap(this, (width * s).toInt(), (height * s).toInt(), true)
}

fun Bitmap.toJpeg(quality: Int = 80): ByteArray =
    ByteArrayOutputStream().use { compress(Bitmap.CompressFormat.JPEG, quality, it); it.toByteArray() }

private fun luma(argb: Int) =
    (Color.red(argb) * 299 + Color.green(argb) * 587 + Color.blue(argb) * 114) / 1000

/** 9×8 grayscale gradient hash. Robust to small noise and exposure changes. */
fun Bitmap.dHash(): Long {
    val small = Bitmap.createScaledBitmap(this, 9, 8, true)
    var hash = 0L
    var bit = 0
    for (y in 0 until 8) for (x in 0 until 8) {
        if (luma(small.getPixel(x, y)) > luma(small.getPixel(x + 1, y))) hash = hash or (1L shl bit)
        bit++
    }
    if (small !== this) small.recycle()
    return hash
}

fun Long.hamming(other: Long): Int = java.lang.Long.bitCount(this xor other)
```

Dedupe operator. It compares against the **last emitted** frame, so slow drift cannot slip past.

```kotlin
fun Flow<SceneFrame>.dedupe(maxDistance: Int = 6, heartbeatMs: Long = 10_000): Flow<SceneFrame> = flow {
    var last: SceneFrame? = null
    collect { f ->
        val prev = last
        val changed = prev == null ||
            f.dHash.hamming(prev.dHash) > maxDistance ||
            f.tsMs - prev.tsMs > heartbeatMs
        if (changed) { last = f; emit(f) }
    }
}
```
Tune `maxDistance` on the real POV clip. Six is a guess **[UNVERIFIED]**.

### 2.3 PhoneCameraSource (CameraX)

CameraX facts checked **[DOC]** developer.android.com/media/camera/camerax/analyze: `ImageAnalysis` default output is `YUV_420_888`. `STRATEGY_KEEP_ONLY_LATEST` keeps only the newest image while the analyzer is busy. You **must** call `ImageProxy.close()`. Bind on the main thread. `ImageProxy.toBitmap()` exists in recent CameraX releases; I did not confirm the exact version **[UNVERIFIED]**.

```kotlin
class PhoneCameraSource(
    private val context: Context,
    private val owner: LifecycleOwner,   // an Activity or fragment in STARTED/RESUMED
    private val intervalMs: Long = 1_000,
    private val maxSidePx: Int = 512,
) : FrameSource {

    override fun frames(): Flow<SceneFrame> = callbackFlow {
        val analysisExecutor = Executors.newSingleThreadExecutor()
        val mainExecutor = ContextCompat.getMainExecutor(context)
        val providerFuture = ProcessCameraProvider.getInstance(context)
        var lastEmitMs = 0L   // touched only on analysisExecutor

        val analysis = ImageAnalysis.Builder()
            .setTargetResolution(Size(1280, 720))
            .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
            .build()

        analysis.setAnalyzer(analysisExecutor) { image ->
            try {
                val now = SystemClock.elapsedRealtime()
                // Gate BEFORE any conversion: at 30 fps, JPEG work on every frame would kill the CPU.
                if (now - lastEmitMs >= intervalMs) {
                    lastEmitMs = now
                    val bmp = image.toBitmap().rotate(image.imageInfo.rotationDegrees)
                    val small = bmp.downscale(maxSidePx)
                    trySend(SceneFrame(small.toJpeg(80), small.dHash(), now, Origin.PHONE))
                }
            } finally {
                image.close()
            }
        }

        providerFuture.addListener({
            val provider = providerFuture.get()
            provider.unbindAll()
            provider.bindToLifecycle(owner, CameraSelector.DEFAULT_BACK_CAMERA, analysis)
        }, mainExecutor)

        awaitClose {
            providerFuture.addListener({ providerFuture.get().unbindAll() }, mainExecutor)
            analysisExecutor.shutdown()
        }
    }.conflate()   // newest frame wins if the consumer is slow
}
```

Note: `analysis.setAnalyzer` replaces any earlier analyzer. Only one `PhoneCameraSource` should be active at a time.

### 2.4 VideoFileSource (repeatable POV clip)

`MediaMetadataRetriever` gives a repeatable, emulator-friendly source. Software decode handles H.265 on most emulators **[UNVERIFIED]**. Decode time is fine at 1 fps.

```kotlin
class VideoFileSource(
    private val context: Context,
    private val uri: Uri,               // content:// or file:// (copy assets to cacheDir first)
    private val intervalMs: Long = 1_000,
    private val maxSidePx: Int = 512,
    private val loop: Boolean = true,
) : FrameSource {

    override fun frames(): Flow<SceneFrame> = flow {
        val retriever = MediaMetadataRetriever()
        try {
            retriever.setDataSource(context, uri)
            val durationMs = retriever.extractMetadata(MediaMetadataRetriever.METADATA_KEY_DURATION)?.toLong() ?: 0L
            var t = 0L
            while (currentCoroutineContext().isActive) {
                retriever.getFrameAtTime(t * 1_000, MediaMetadataRetriever.OPTION_CLOSEST_SYNC)?.let { raw ->
                    val small = raw.downscale(maxSidePx)
                    emit(SceneFrame(small.toJpeg(80), small.dHash(), t, Origin.VIDEO))
                    if (small !== raw) small.recycle()
                    raw.recycle()
                }
                delay(intervalMs)
                t += intervalMs
                if (t >= durationMs) { if (loop) t = 0 else break }
            }
        } finally {
            retriever.release()
        }
    }.flowOn(Dispatchers.IO)
}
```

Record the POV clip on the demo phone in landscape or portrait, but **keep the same orientation as the mock feed**, 720p or less, 10–20 s of real content (kitchen, plate, cigarette pack, sunny balcony). Save it as H.265 `.mov` for MDK **[DOC]**.

### 2.5 StaticImageSource (tests)

```kotlin
class StaticImageSource(
    private val jpegOrPng: ByteArray,
    private val intervalMs: Long = 1_000,
    private val repeat: Boolean = false,
) : FrameSource {
    override fun frames(): Flow<SceneFrame> = flow {
        val bmp = BitmapFactory.decodeByteArray(jpegOrPng, 0, jpegOrPng.size) ?: return@flow
        val small = bmp.downscale(512)
        val jpeg = small.toJpeg(80)
        val hash = small.dHash()
        do {
            emit(SceneFrame(jpeg, hash, SystemClock.elapsedRealtime(), Origin.STATIC))
            if (repeat) delay(intervalMs)
        } while (repeat)
    }.flowOn(Dispatchers.Default)
}
```
In unit tests, use `dedupe()` on a list of images to assert that near-identical frames drop and changed ones pass.

### 2.6 MetaGlassesSource (DAT / MDK)

Design choice: for the Gemini path, use **`stream.capturePhoto()` in a serial loop**. The docs give a `Bitmap` directly (`PhotoData.Bitmap`), so we skip the undocumented YUV plane layout. Use `videoStream` only for the live preview. One capture in flight **[DOC]**. Capture is slower than 1 fps might suggest; **measure it [UNVERIFIED]**.

```kotlin
class MetaGlassesSource(
    private val session: DeviceSession,      // created and STARTED by the caller
    private val intervalMs: Long = 1_000,
    private val maxSidePx: Int = 512,
) : FrameSource {

    override fun frames(): Flow<SceneFrame> = callbackFlow {
        // Use fold/onFailure in production; getOrThrow turns a failure into a flow error.
        val camera = session.addCamera(
            StreamConfiguration(videoQuality = VideoQuality.MEDIUM, frameRate = 15)
        ).getOrThrow()
        val stream = camera.stream

        // Subscribe to state before start(). Waiting for STREAMING is an assumption [UNVERIFIED].
        val live = launch { stream.state.first { it == StreamState.STREAMING } }
        stream.start()
        live.join()

        val loop = launch {
            while (isActive) {
                stream.capturePhoto().onSuccess { photo ->
                    val bmp = when (photo) {
                        is PhotoData.Bitmap -> photo.bitmap
                        else -> null   // encoded ByteBuffer path: decode with EXIF orientation, see CameraViewModel.decodeWithOrientation
                    }
                    bmp?.let {
                        val small = it.downscale(maxSidePx)
                        trySend(SceneFrame(small.toJpeg(80), small.dHash(), SystemClock.elapsedRealtime(), Origin.GLASSES))
                    }
                }
                delay(intervalMs)
            }
        }

        awaitClose {
            loop.cancel()
            camera.stop()           // sample pattern [CODE] CameraViewModel.stopStreaming
        }
    }.conflate()
}
```

Session setup (before this source): `Wearables.initialize`, `createSession(AutoDeviceSelector())`, `session.start()`, `session.state.first { it == DeviceSessionState.STARTED }`. If the session drops to `STOPPED`, close the source and create a new session. A stopped session cannot restart **[DOC]**.

### 2.7 AudioOut (TTS through the glasses speaker)

`TextToSpeech` API checked **[DOC]** developer.android.com/reference/android/speech/tts/TextToSpeech: constructor with `OnInitListener`, `speak(text, queueMode, params, utteranceId)`, `QUEUE_FLUSH`, `setAudioAttributes`, `setOnUtteranceProgressListener`, `shutdown()`. Usage `USAGE_ASSISTANT` is my choice **[UNVERIFIED for routing]**. Speaker output is whatever Android routes to A2DP.

```kotlin
interface AudioOut {
    suspend fun speak(text: String)
    fun stop()
}

class TtsAudioOut(context: Context) : AudioOut, AutoCloseable {
    private val ready = CompletableDeferred<Boolean>()
    private val tts = TextToSpeech(context.applicationContext) { status ->
        val ok = status == TextToSpeech.SUCCESS
        if (ok) {
            // Route as assistant speech. Glasses speaker = whatever A2DP device Android picks [UNVERIFIED].
            tts.setAudioAttributes(
                AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_ASSISTANT)
                    .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                    .build()
            )
        }
        ready.complete(ok)
    }

    override suspend fun speak(text: String) {
        if (!ready.await()) return
        suspendCancellableCoroutine { cont ->
            val id = UUID.randomUUID().toString()
            tts.setOnUtteranceProgressListener(object : UtteranceProgressListener() {
                override fun onStart(utteranceId: String?) = Unit
                override fun onDone(utteranceId: String?) {
                    if (utteranceId == id && cont.isActive) cont.resume(Unit)
                }
                override fun onError(utteranceId: String?, errorCode: Int) {
                    if (utteranceId == id && cont.isActive) cont.resume(Unit)
                }
            })
            tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, id)
            cont.invokeOnCancellation { tts.stop() }
        }
    }

    override fun stop() { tts.stop() }
    override fun close() { tts.shutdown() }
}
```

Caveat: there is one global progress listener, so run one `speak` at a time. Fine for a hackathon. Keep the `TextToSpeech` instance alive for the app's life, not per screen.

### 2.8 Threading and lifecycle

| Stage | Thread | Why |
| --- | --- | --- |
| CameraX analyzer | Single background executor (`newSingleThreadExecutor`) | CameraX requires `close()` on the analyzer thread path; keeps JPEG work off main. |
| `bindToLifecycle` | Main | CameraX requirement. |
| MDK / DAT callbacks and `capturePhoto` | Coroutines in `viewModelScope` / `Dispatchers.IO` | SDK calls are suspend or flow based. |
| `VideoFileSource` decode | `Dispatchers.IO` | Blocking retriever calls. |
| dHash and JPEG | `Dispatchers.Default` (via `flowOn`) | CPU work. |
| Analysis worker (Gemini) | `Dispatchers.IO`, fed by `Channel(CONFLATED)` | One call in flight; newest frame replaces a stale one. |
| HUD state | `StateFlow`, collected on Main | Compose-safe. |
| TTS | Callable from any coroutine; listener callbacks on TTS binder thread | Resume continuations only; no UI work in callbacks. |

Scope: one `CoroutineScope(SupervisorJob() + Dispatchers.Default)` owned by the ViewModel. Pipeline:

```kotlin
val sceneFrames: SharedFlow<SceneFrame> = source.frames()
    .dedupe()
    .flowOn(Dispatchers.Default)
    .shareIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), replay = 0)
```

Switching source (for example to MDK in the middle of a demo): cancel the old collector first, then start the new source. Never run two `FrameSource`s into the same HUD.

---

## 3. Glasses HUD demo UI

### 3.1 Principles

- **600×600, square, black.** Matches the Ray-Ban Display surface. Keep one message per screen. The DAT display sends full views, so think in full screens, not patches **[DOC] display-overview**.
- **Three type sizes:** HEADING / BODY / META, matching DAT `TextStyle`. Keep text short. Keep the root (L0) view always reachable.
- **Bystander indicator:** a small red dot and "CAPTURING · wearer view" in META style. This meets the AUP "obvious to bystanders" principle **[DOC] AUP**.
- **No face recognition, no bystander analysis.** Wearer's food, drink, sun and smoking only.
- **Medical wording:** "nudge", "swap", "limit", "tip". Never "diagnosis", "risk %", "treats", "prevents".

### 3.2 States and Compose sketch

```kotlin
sealed interface HudState {
    data object Idle : HudState
    data class Scanning(val hint: String) : HudState
    data class Result(val title: String, val tip: String, val level: Level) : HudState
    data class Spoken(val text: String) : HudState
}

enum class Level { OK, LIMIT, SWAP }

@Composable
fun GlassesHud(state: HudState, modifier: Modifier = Modifier) {
    Box(
        modifier
            .aspectRatio(1f)                       // 600×600
            .background(Color.Black)
            .border(1.dp, Color.White.copy(alpha = 0.15f))
            .padding(24.dp),
        contentAlignment = Alignment.Center,
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(12.dp)) {
            when (state) {
                HudState.Idle -> HudText("Look at your food", Style.BODY)
                is HudState.Scanning -> HudText(state.hint, Style.META)
                is HudState.Result -> {
                    HudText(state.title, Style.HEADING, accent = state.level.color())
                    HudText(state.tip, Style.BODY)
                }
                is HudState.Spoken -> HudText(state.text, Style.BODY)
            }
        }
        // Bystander/recording indicator, always on
        Row(Modifier.align(Alignment.TopStart), verticalAlignment = Alignment.CenterVertically) {
            Box(Modifier.size(8.dp).background(Color.Red, CircleShape))
            Spacer(Modifier.width(6.dp))
            HudText("CAPTURING · wearer view", Style.META)
        }
    }
}

private enum class Style(val size: TextUnit, val weight: FontWeight) {
    HEADING(26.sp, FontWeight.Bold), BODY(18.sp, FontWeight.Normal), META(12.sp, FontWeight.Light)
}
```

`HudText`, `Level.color()` and the `Style` mapping are simple helpers. Colour choices are placeholders. The real display colour and palette are **[UNVERIFIED]**; check the simulator before the pitch.

### 3.3 Renderer seam (so the same state drives both targets)

`HudState` → `GlassesHud` (phone, for the demo) and → `sendContent { flexBox { text(...) } }` (DAT Display, real Ray-Ban Display later). Keep the mapping in one function so the DAT path is a small addition, not a rewrite.

```kotlin
// Later, on Meta Ray-Ban Display hardware or its MDK preview:
display.sendContent {
    flexBox(direction = Direction.COLUMN, gap = 12) {
        text(state.title, style = TextStyle.HEADING)
        text(state.tip, style = TextStyle.BODY)
    }
}
```
Names from the docs **[DOC] display-android**. Not compiled.

### 3.4 Scripted demo mode (required for a reliable pitch)

A `demo_script.json` (or Kotlin list) with the expected result for each clip segment. The HUD runs the same states from a timeline. The live model call is a switch. This protects against Wi-Fi, API latency and model variance. Results come from a real call when we can afford it. Gemini Decisions API price and latency are in [03-sdk-samples-sweep.md].

---

## 4. Staging the 2-minute pitch

### 4.1 Rig

- **Phone on a chest or head-strap mount**, rear camera forward at eye height, **portrait** (matches the 9:16 DAT frame and the 24 fps / 720×1280 demo). Lens clear. Screen on, Do Not Disturb on, auto-lock off.
- **Backup**: pre-recorded POV clip playing on a second device, plus a full screen recording of the HUD run.
- **Mirror**: `scrcpy` from a laptop to the projector. Flags below are from memory **[UNVERIFIED for this scrcpy version]**; check `scrcpy --help` first:
  ```sh
  scrcpy --stay-awake --max-size=1080 --window-title="HUD" --record=/home/michal/Videos/hud-demo.mp4
  ```
  `--record` gives a backup even if the projector fails. `scrcpy` also works with emulators, so one command covers both.
- **Audio**: TTS through the phone speaker, or through glasses only if a real BT device is paired. Do not rely on Bluetooth in a crowded room. Have a volume fallback (captions on the HUD).

### 4.2 Script (timings are targets)

| Time | Beat | What the audience sees |
| --- | --- | --- |
| 0:00–0:15 | Problem: most cancer risk is lifestyle, and the moment to act is the meal or the sunny afternoon. | Title card, then the phone mirror with the HUD in "Idle". |
| 0:15–0:45 | **Live beat 1.** Wearer looks at a plate. | HUD: "Processed meat · SWAP" + one tip. TTS speaks it. |
| 0:45–1:15 | **Live beat 2.** Sunny balcony, no shade. | HUD: "Strong sun, no shade · LIMIT". Short spoken tip. |
| 1:15–1:40 | Tech under the hood: MDK stands in for the glasses, same `FrameSource` interface, DAT path ready. | Simple architecture slide; no backend secrets in the app. |
| 1:40–2:00 | Honesty and close: "emulated, not medical advice, the real glasses are the next step". | Disclaimer line on screen. |

Rehearse three times. Know which segment to skip if the clock runs over.

---

## 5. Risks and open items

| # | Item | Status | How to settle |
| --- | --- | --- | --- |
| 1 | MDK video feed format: H.265 required (docs) vs H.264 also supported (skill) | **Conflict [UNVERIFIED]** | Use H.265; test both on the emulator. |
| 2 | Coexistence of CameraX with MDK phone-camera feed | **[UNVERIFIED]** | Avoid. Do not run both. |
| 3 | MDK works on Android emulators? | **[UNVERIFIED]** | Day-one spike: pair, power, don, `setCameraFeed(uri)`, `capturePhoto()`. |
| 4 | Pixel-plane layout of uncompressed `VideoFrame.buffer` | **[UNVERIFIED]** | Avoid. Use `capturePhoto()` or `compressVideo`. |
| 5 | `capturePhoto()` throughput (can it sustain 1 fps?) | **[UNVERIFIED]** | Measure on the real phone. Fall back to a 0.5 fps interval. |
| 6 | Mock microphone or speaker | **Not documented [UNVERIFIED]** | Use the phone mic/TTS for demo. |
| 7 | Glasses speaker routing via A2DP for `USAGE_ASSISTANT` | **[UNVERIFIED]** | Test with a BT headset first. |
| 8 | Min SDK, Kotlin version | **[UNVERIFIED]** | Read `samples/CameraAccess/build.gradle.kts` or set `minSdk` 29 and check. |
| 9 | Developer Account and Organization needed for MDK-only use | **Likely yes [DOC Terms §3]** | Sign up before hackathon day. |
| 10 | Judged demo = "distribution"? | **[UNVERIFIED]** | Ask organisers. Keep the APK private. |
| 11 | Medical-device framing | **Risk [DOC Terms §2]** | Use "nudge / education" wording and a disclaimer. |
| 12 | CameraX `ImageProxy.toBitmap()` exact version | **[UNVERIFIED]** | Check the CameraX release notes for the version pinned in the project. |
| 13 | Display colour and HUD font on real Ray-Ban Display | **[UNVERIFIED]** | Check in the Display Simulator. |

---

## 6. Sources

Meta DAT (official docs, fetched as Markdown):
- Android integration: https://wearables.developer.meta.com/docs/develop/dat/build-integration-android/ (md: https://wearables.developer.meta.com/wearables-docs/docs-markdown/develop/dat/build-integration-android.md)
- Streaming: https://wearables.developer.meta.com/docs/develop/dat/streaming/
- Camera stream processing: https://wearables.developer.meta.com/docs/develop/dat/camera-stream-processing/
- Camera capture (photo, beta): https://wearables.developer.meta.com/docs/develop/dat/camera-capture/
- Microphones and speakers: https://wearables.developer.meta.com/docs/develop/dat/microphones-and-speakers/
- Session lifecycle: https://wearables.developer.meta.com/docs/develop/dat/lifecycle-events/
- Mock Device Kit overview: https://wearables.developer.meta.com/docs/develop/dat/mock-device-kit/
- Android MDK testing: https://wearables.developer.meta.com/docs/develop/dat/testing-mdk-android/
- Display overview: https://wearables.developer.meta.com/docs/develop/dat/display-overview/
- Display Android: https://wearables.developer.meta.com/docs/develop/dat/display-android/
- Display simulation: https://wearables.developer.meta.com/docs/develop/dat/display-simulation/
- Getting started / setup: https://wearables.developer.meta.com/docs/develop/dat/getting-started-toolkit/

Meta legal:
- Developer Terms (last updated 2025-10-06): https://wearables.developer.meta.com/terms/
- Acceptable Use Policy (last updated 2026-09-22): https://wearables.developer.meta.com/acceptable-use-policy/

Official source (GitHub, `meta/meta-wearables-dat-android`, read via `gh api`):
- Repo root and LICENSE pointer: https://github.com/meta/meta-wearables-dat-android
- `samples/CameraAccess/README.md` (requirements, local.properties)
- `samples/CameraAccess/app/src/main/java/com/meta/wearable/dat/externalsampleapps/cameraaccess/camera/CameraViewModel.kt` (stream config, frame handling, photo decode, stop)
- `…/cameraaccess/mockdevicekit/MockDeviceKitViewModel.kt` (enable, pairGlasses, setCameraFeed Uri and CameraFacing)
- `plugins/mwdat-android/skills/camera-streaming/SKILL.md` (YUV vs compressVideo)
- `plugins/mwdat-android/skills/mockdevice-testing/SKILL.md` (mock setup, formats table)

Android developer docs:
- CameraX image analysis: https://developer.android.com/media/camera/camerax/analyze
- TextToSpeech reference: https://developer.android.com/reference/android/speech/tts/TextToSpeech

Repo context:
- Earlier sweep: `docs/research/glasses/emulation/03-sdk-samples-sweep.md` (corrections in 1.6)
- Direction B brief: `docs/README.md`
