# 02 — Android testing for the glasses app (emulators and real phones)

Scope: native Kotlin app (Compose, CameraX). Pipeline: camera frames → backend → Gemini Decisions API (`gemini-decision-1`, `v1beta`) → spoken nudge (TextToSpeech). We test on Android emulators and on real phones. The real phone camera must work.

Research date: 2026-11-14. Method: developer.android.com and docs.maestro.dev pages fetched; GitHub API and Maven/Google Maven metadata read with curl; scrcpy docs read. Items marked **UNVERIFIED** were not confirmed on an official page. Check them on your own SDK or device before the demo.

Terms: **FrameSource** = our app's interface that yields camera frames (CameraX adapter in the app, file/video/fake in tests). **Decisions client** = our backend call that wraps Gemini Decisions. **AVD** = Android Virtual Device (emulator).

---

## 0. Recommendation in 6 lines

1. Put all camera input behind `FrameSource`. Tests and the demo fallback use a file or video source, so the emulator camera is only one of several inputs.
2. Emulator: start with `-camera-back imagefile:<abs path>` (fixed frame, deterministic) or `videofile:<abs path>` (moving frames). Use `webcam0` only for live checks.
3. Real phone: USB first, Wi-Fi as backup (Android 11+ wireless debugging). Grant CAMERA at install with `adb install -g`, and still handle a denied or one-time permission in code.
4. Tests: JVM unit tests (fakes + `kotlinx-coroutines-test` + `mockwebserver3`), Roborazzi screenshots, Compose UI tests, Maestro for end-to-end flows. Skip CameraX test fakes in the demo path.
5. Demo safety: a recorded-video mode and a cached-decisions offline mode, both built into the app and switchable without a network call.
6. Run the 36-hour checklist in section 7. Keep a screen recording of a full good run as backup.

---

## 1. Emulator camera

### 1.1 Options (what the emulator supports)

| Mode | How to set | What it gives | Source |
|---|---|---|---|
| Emulated | AVD setting or `-camera-back emulated` | Generated simple picture. Checks that code runs, not scene content. | https://developer.android.com/studio/run/emulator-commandline |
| Virtual scene | AVD setting or `-camera-back environment` (new in emulator 36.6.11, scenes in `environment.ini`) | 3D room you can walk through. Import PNG/JPEG posters via Extended controls → Camera → Virtual scene images. | https://developer.android.com/studio/run/emulator-use-camera , https://developer.android.com/studio/releases/emulator |
| Webcam passthrough | `-camera-back webcam0` (list names with `-webcam-list`) | Live feed from a host webcam. Good for real-time pointing tests. | https://developer.android.com/studio/run/emulator-commandline |
| **Image file** | `-camera-back imagefile:/abs/path/frame.jpg` | Fixed image as camera output. Repeatable. | https://developer.android.com/studio/run/emulator-commandline |
| **Video file** | `-camera-back videofile:/abs/path/clip.mp4` | Video as camera output. Repeatable. Looping behaviour **UNVERIFIED**. | https://developer.android.com/studio/run/emulator-commandline |
| 360 image | `-camera-back image360:<file>` (emulator 36.6.4+) | Equirectangular panorama. Not needed for us. | https://developer.android.com/studio/run/emulator-commandline |
| None | `-camera-back none` | Disables camera. Use to test the "no camera" path. | https://developer.android.com/studio/run/emulator-commandline |

The command-line flag overrides the camera setting in the AVD (per the commandline page). Camera Extended-controls mode is not needed when you pass the flag.

Caveat: the `emulator` binary is marked deprecated on the commandline page in favour of `android emulator` (Android CLI). Flags are still documented there. Whether `android emulator start` forwards `-camera-back` is **UNVERIFIED**. Check `emulator -help-camera` or `emulator -help-all` on your SDK version. Latest stable emulator in the release notes: 37.2.12 (Oct 1, 2026); newest patch 37.2.13 (Oct 28, 2026), unlabelled.

Webcam on Linux: the emulator reads host webcams through its own backend. Confirm `-webcam-list` shows `webcam0` on this machine before relying on it. **UNVERIFIED** whether a v4l2loopback device (see 2.3) is listed.

### 1.2 Repeatable injection of our own media

Recommended order for repeatability:

1. **`imagefile:`** — one JPEG per scenario (e.g. `processed_meat.jpg`, `cigarette.jpg`, `sunny_no_shade.jpg`, `negative_salad.jpg`). Restart the emulator with the flag. Same input every run.
2. **`videofile:`** — for "walk past a food stand" sequences. Confirm it loops for the demo length; if not, use the file's full length and keep it short.
3. **Virtual scene images** (Extended controls → Camera → Virtual scene images → Add image, PNG/JPEG) — for QR-style or poster tests. Manual, not scripted. Good for one-off checks only.
4. **Webcam passthrough** — live pointing check. Not repeatable.

Recipe (agent or human):

```sh
# 1. Stop any running emulator for this AVD
adb -s emulator-5554 emu kill

# 2. Start headless with our scenario frame as the back camera
emulator -avd <AVD_NAME> \
  -no-window -no-audio -no-boot-anim -no-snapshot-save \
  -gpu swiftshader_indirect \
  -camera-back imagefile:/abs/path/scenario-processed-meat.jpg \
  -camera-front none

# 3. Wait for boot (standard pattern, UNVERIFIED on this SDK)
adb wait-for-device
until [ "$(adb shell getprop sys.boot_completed | tr -d '\r')" = "1" ]; do sleep 2; done
```

Flags confirmed on https://developer.android.com/studio/run/emulator-commandline: `-no-window`, `-no-audio` (also `-noaudio`), `-no-boot-anim`, `-no-snapshot-save`, `-no-snapshot-load`, `-gpu swiftshader_indirect`, `-camera-back`, `-camera-front`, `-wipe-data`, `-port`/`-ports`.

Snapshots: the snapshots page says snapshots are unreliable with software rendering (`-gpu swiftshader_indirect` is software). Use `-no-snapshot` or `-no-snapshot-save` in CI and for scripted runs: https://developer.android.com/studio/run/emulator-snapshots

### 1.3 Headless emulator

- `-no-window`: no display, control via adb. Confirmed on the commandline page.
- `-gpu swiftshader_indirect`: software GPU. Used in the commandline page's example. Hardware GPU (`-gpu host`) is faster on a dev laptop with a GPU; **UNVERIFIED** on this machine, so test it.
- Headless build binary `emulator-headless` existed from release 28.0.25 (Mar 2019) per release notes. Treat as legacy; the `-no-window` flag is the documented path.
- KVM must be available on Linux. Check with `emulator -accel-check` (commandline page).

---

## 2. Real phones

### 2.1 ADB over USB

- Enable Developer options and USB debugging on the phone; accept the RSA prompt on the host.
- `adb devices` lists serials. Use `adb -s <serial> ...` when more than one device is connected (adb docs: https://developer.android.com/tools/adb).

### 2.2 ADB over Wi-Fi

| Phone Android version | Steps | Source |
|---|---|---|
| Android 11+ | Settings → Developer options → Wireless debugging. Tap "Pair device with pairing code", then `adb pair <ip>:<pairing-port>` and enter the 6-digit code, then `adb connect <ip>:<connect-port>` (the port shown on the main Wireless debugging screen). | https://developer.android.com/tools/adb |
| Android 10 and lower | Connect by USB first, then `adb tcpip 5555`, then `adb connect <device_ip>:5555`. Reconnect with `adb connect` after the phone restarts. | https://developer.android.com/tools/adb |

Rules for us:
- The pairing code is a short-lived credential. The user types it on their own terminal. Do not paste it into chat or a tool.
- Keep USB as the demo backup. Wi-Fi debugging can drop when the venue Wi-Fi changes.

### 2.3 scrcpy for pitch mirroring

- Current release: scrcpy **v5.0.1**, published 2026-10-08 (GitHub API: https://api.github.com/repos/Genymobile/scrcpy/releases/latest). Repo: https://github.com/Genymobile/scrcpy
- Display mirroring (what the audience sees on the phone screen) works over USB or TCP/IP and needs no app on the device. Android 5.0+ (README).
- Camera mirroring (what the phone camera sees): `scrcpy --video-source=camera`, Android 12+. Options: `--camera-facing=back`, `--camera-id=0`, `--camera-torch`. Source: https://github.com/Genymobile/scrcpy/blob/master/doc/camera.md
- Linux only: mirror as a V4L2 webcam (README). Flag name **UNVERIFIED** — check `scrcpy --help`. If it works, the phone camera could feed the laptop as `webcam0`, which the emulator can then use with `-camera-back webcam0`. Untested idea; test it before relying on it.
- **Conflict risk (UNVERIFIED):** camera mirroring and our app both open the phone camera. Do not run camera mirroring during a live CameraX test. Use display mirroring only during the demo.
- Audio: camera mirroring defaults to mic audio (camera.md). If we don't need audio, add `--no-audio` (flag name **UNVERIFIED**, check `--help`) so scrcpy doesn't touch the mic.
- Recording: scrcpy can record the mirrored output (`--record`, **UNVERIFIED** flag name) — use as the backup video of a live run.

### 2.4 Camera and microphone permissions

From https://developer.android.com/training/permissions/requesting:

- CAMERA is a dangerous permission: check with `ContextCompat.checkSelfPermission`, explain with `shouldShowRequestPermissionRationale`, request with `ActivityResultContracts.RequestPermission`. Handle denial gracefully (show a message, keep the rest usable).
- Android 11+: the camera dialog has **"Only this time"**. A one-time grant ends when the app goes to background. If the user revokes it, the app process is terminated. Re-check permission in `onResume`.
- Android 12+ shows a camera/mic privacy indicator. Tell the audience, or expect a dot in the status bar.
- `adb install -g <apk>` grants all runtime permissions at install time (testing only). Quoted from the same page.
- Inspect permission state: `adb shell dumpsys package <package>` (look for `granted=`, `USER_SET`, `USER_FIXED`). Reset denied-twice flags: `adb shell pm clear-permission-flags <package> android.permission.CAMERA user-set user-fixed` (both from the same page).
- RECORD_AUDIO: only request it if we take speech input. For TTS output alone, do not declare it (fewer prompts, less to explain).
- Also **UNVERIFIED** (from memory, check on device): `adb shell pm grant <package> android.permission.CAMERA` works on debug builds.

### 2.5 Logcat filtering

From https://developer.android.com/tools/logcat:

```sh
# Only our tag at debug and up, silence everything else
adb -s <serial> logcat MyTag:D *:S

# Warnings and errors from all tags
adb -s <serial> logcat *:W

# Save the output format with time and PID (default is threadtime)
adb -s <serial> logcat -v threadtime MyTag:D *:S
```

- Filter syntax: `tag:priority`, whitespace-separated, `*:S` as an allowlist. Priorities V, D, I, W, E, F, S. Quoted in shells that expand `*`.
- Buffers: `-b main`, `-b system`, `-b crash`, `-b all` (page lists these).
- Clear the buffer before a run: `adb logcat -c` (**UNVERIFIED** from memory; check `adb logcat --help`).
- Per-process filter (`--pid`): **UNVERIFIED** on this SDK; the page lists only tag/priority filters.
- Log from code with `Log.d("NudgeCoord", ...)`. Give the app one tag per component so filters stay short.

---

## 3. Automated tests

### 3.1 JVM unit tests (fakes first)

Test seams:
- `FrameSource` interface (`Flow<Frame>` or `suspend fun next(): Frame`). Fakes: a list of canned frames, a looping file, a failing source.
- `DecisionsClient` interface. Fake returns canned `Decision` objects, plus a slow-response and a failing variant.
- Coroutines: `kotlinx-coroutines-test` **1.11.0** (Maven Central latest, checked 2026-11-14: https://repo1.maven.org/maven2/org/jetbrains/kotlinx/kotlinx-coroutines-test/maven-metadata.xml). Use `runTest` and `StandardTestDispatcher`/`TestScope`; inject the dispatcher into the coordinator.
- HTTP client tests: OkHttp **5.5.1** plus `mockwebserver3` **5.5.1** (Maven Central: https://repo1.maven.org/maven2/com/squareup/okhttp3/mockwebserver3/maven-metadata.xml). The artifact name and package follow OkHttp 5 (`mockwebserver3`); package name **UNVERIFIED** — check the import when you add it.

What to test on the JVM:
- Coordinator: frame → decision → nudge when probability ≥ threshold; cool-down (no repeat nudge for N seconds); stale-frame drop; timeout falls back to cached decision.
- Decisions client: request JSON body shape; 429 / 5xx retry with backoff; malformed JSON.
- Offline fallback: cache hit returns stored decisions; cache miss returns "no nudge", never crashes.

### 3.2 Compose UI tests

- Use `createComposeRule()` for a screen under test, `createAndroidComposeRule<Activity>()` if an activity is needed (https://developer.android.com/develop/ui/compose/testing , https://developer.android.com/develop/ui/compose/testing/common-patterns).
- Dependency: `androidx.compose.ui:ui-test-junit4` (+ `ui-test-manifest` in debug). Let the Compose BOM pick the version. Latest BOM seen: `2026.09.00` (Google Maven metadata). Stable ui-test-junit4 seen: 1.12.1 (**the BOM's mapped version is UNVERIFIED**).
- Run on JVM with Robolectric (fast), or instrumented on device/emulator (needed for real camera preview).

### 3.3 CameraX testing

- The CameraX testing docs (https://developer.android.com/agents/skills/camera/camerax/references/testing) mention `androidx.camera:camera-testing` (`FakeAppConfig`, `CameraXTestRule`). **Conflict:** the Google Maven group index (https://dl.google.com/dl/android/maven2/androidx/camera/group-index.xml, read 2026-11-14) does not list a `camera-testing` artifact. It lists `camera-common-testing`, whose newest version in that index is 1.7.0-rc02 (no stable seen). Treat `camera-testing` as **UNVERIFIED / likely removed**.
- Recommendation: do not build the demo path on CameraX fakes. Put CameraX behind `FrameSource`; unit-test everything above it with fakes; test the CameraX adapter manually on the emulator and on a real phone.
- CameraX stable seen on Google Maven: `camera-camera2` **1.6.2** (1.7.0-rc02 is newest RC). Use `camera-core`, `camera-camera2`, `camera-lifecycle`, `camera-view` at 1.6.2 for the app. Check the group index before upgrading.

### 3.4 Screenshot tests (Roborazzi)

- Roborazzi **1.79.0** (GitHub release 2026-11-12: https://api.github.com/repos/takahirom/roborazzi/releases/latest; Maven Central latest: https://repo1.maven.org/maven2/io/github/takahirom/roborazzi/roborazzi-compose/maven-metadata.xml).
- Setup (from https://github.com/takahirom/roborazzi):
  - Root `build.gradle.kts`: `id("io.github.takahirom.roborazzi") version "1.79.0" apply false`
  - Module: `id("io.github.takahirom.roborazzi")`
  - Test deps: `roborazzi`, `roborazzi-compose` (`junit-rule` optional).
  - Robolectric **4.10-alpha-1 or later** required; add `@GraphicsMode(GraphicsMode.Mode.NATIVE)`. Robolectric latest on Maven Central: **4.18** (https://repo1.maven.org/maven2/org/robolectric/robolectric/maven-metadata.xml).
- Commands: `./gradlew recordRoborazziDebug` (record), `./gradlew verifyRoborazziDebug` (fail on diff), `./gradlew compareRoborazziDebug` (diff images + JSON).
- Use for: the nudge card, the "no camera" banner, the "offline / cached" banner. One image per state, not per pixel of the camera feed (the camera feed is not deterministic).

### 3.5 End-to-end: Maestro vs Espresso

| | Maestro | Espresso / Compose instrumented |
|---|---|---|
| Language | YAML flows | Kotlin |
| Runs on | Emulator and real phone via adb (`maestro --device=<serial>`) | Emulator and phone via Gradle |
| Good for | Full-app flows: launch → grant permission → point at scenario → hear nudge text on screen | Component checks, custom idling |
| Output | JUnit (`--format=JUNIT`), HTML, screenshots (`takeScreenshot`) | Gradle test reports |
| Weakness | Camera feed and TTS audio are not checked; flaky if the UI depends on live frames | More code per flow |

**Recommendation:** Maestro for two or three end-to-end smoke flows (see section 4.4 for commands). Compose/Espresso for component tests. Latest Maestro CLI: **cli-2.12.1**, published 2026-11-02 (https://api.github.com/repos/mobile-dev-inc/maestro/releases). Maestro needs Java 17+ (https://docs.maestro.dev/maestro-cli/how-to-install-maestro-cli.md).

### 3.6 Optional live contract test (behind a flag)

- Purpose: check that our backend's decisions endpoint still returns the shape the app parses. It must not run in normal CI.
- Gate: skip unless an env var is set, e.g. `LIVE_CONTRACT=1`. JUnit4: `Assume.assumeTrue(System.getenv("LIVE_CONTRACT") == "1")`.
- Target: our backend, not Gemini directly. The API key stays on the backend (docs/README.md; the APK never holds it).
- Assert shape and types, not exact probabilities. Gemini's answers are calibrated probabilities, so a fixed value check is flaky.
- Gemini API facts from the repo's skill (`.claude/skills/gemini-api-dev/SKILL.md`, "Decisions API"): `gemini-decision-1`, `v1beta` (`client.decisions.create` / `ai.decisions.create`, or `POST /v1beta/decisions`). Guide: https://aistudio.google.com/docs/decisions-api.md (linked from the skill; not fetched by us).

---

## 4. Agent control: install, launch, tap, screenshot

Rules that apply in T3 (from the T3 device instructions in this session): for tapping, typing, launching, deep links, screenshots and recording on an emulator, use the T3 device tools (`device_list` → `device_open` → `device_screenshot`) and the `agent-device` command they return. Use `adb` for installs, logs, port forwards and running the project's test runners. Do not use `adb` for taps or screenshots in the T3 flow. Real-phone support in the T3 device tools is **UNVERIFIED**.

### 4.1 Emulator lifecycle

- Android CLI (https://developer.android.com/tools/agents): `android emulator list | create [profile] | start <name> | stop <serial> | remove`. Latest syntax seen: `android emulator create [-h] [--list-profiles] [<profile>]` (https://developer.android.com/tools/agents/android-cli/commands/emulator_create). Default profile `medium_phone`.
- Android CLI also lists: `android screen capture`, `android input tap|swipe|scroll|text|key`, `android run`, `android install`. Syntax for these was **not** on the overview page (UNVERIFIED; run `android help <cmd>`).
- Classic emulator binary: section 1.2.

### 4.2 Install, launch, tap, screenshot (adb, for installs and logs)

```sh
adb -s <serial> install -r -g app/build/outputs/apk/debug/app-debug.apk   # -g grants runtime perms (documented)
adb -s <serial> shell am start -n <package>/.MainActivity                 # launch (standard, UNVERIFIED)
adb -s <serial> shell input tap <x> <y>                                   # tap (standard, UNVERIFIED)
adb -s <serial> exec-out screencap -p > /abs/path/shot.png                # screenshot (standard, UNVERIFIED)
adb -s <serial> logcat -v threadtime MyTag:D *:S                          # logs
```

Use an absolute path for `shot.png`; store test output in the scratchpad or `docs/research/...`, not `/tmp`.

### 4.3 Maestro CLI (test runner)

Install (https://docs.maestro.dev/maestro-cli/how-to-install-maestro-cli.md):

```sh
curl -fsSL "https://get.maestro.mobile.dev" | bash      # Linux and macOS
maestro --help                                           # verify
java -version                                            # must be 17+
```

Commands verified on https://docs.maestro.dev/maestro-cli/maestro-cli-commands-and-options.md:

```sh
maestro start-device --platform=android --device-locale=en_US          # boot a standard device
maestro --device=<serial> test flows/smoke.yaml --format=JUNIT --output=build/maestro/smoke.xml
maestro --device=<serial> test flows/ --include-tags=smoke
maestro hierarchy                                                      # print view tree (command exists per the overview page)
maestro record flows/smoke.yaml                                        # record run to MP4
```

Flow YAML (`takeScreenshot` syntax verified on https://docs.maestro.dev/reference/commands-available/takescreenshot.md; the other lines are **UNVERIFIED** from memory — check the command pages linked from https://docs.maestro.dev/api-reference/commands):

```yaml
appId: com.example.nudge        # our package (placeholder)
---
- launchApp:
    clearState: true            # UNVERIFIED key name
- takeScreenshot: 01-launch
- assertVisible: "Point the camera at your plate"   # UNVERIFIED form
- takeScreenshot: 02-scanning
```

Maestro uses its own on-device driver, so it still runs through adb. Under the T3 rule (section 4), use it as a test runner for the suite, not for ad hoc taps.

### 4.4 Real phone from an agent

- Prefer the user running `adb pair` and `adb connect` once (section 2.2). After that the agent runs `adb devices`, `adb -s <serial> install`, `logcat`, and Maestro with `--device=<serial>`.
- If the phone is not in the T3 device list, use the adb commands in 4.2 and note the device serial in the run log.

---

## 5. Minimal Gradle setup (versions checked 2026-11-14)

Versions and sources:

| Component | Version | Source |
|---|---|---|
| Gradle wrapper | **9.9.1** (current) | https://services.gradle.org/versions/current |
| Android Gradle Plugin | **9.5.1** stable (9.6.0-alpha03 is newest, not stable) | https://dl.google.com/dl/android/maven2/com/android/tools/build/gradle/maven-metadata.xml |
| Kotlin / Compose compiler plugin | **2.4.21** stable (2.5.0-RC is newest, RC) | https://repo1.maven.org/maven2/org/jetbrains/kotlin/kotlin-gradle-plugin/maven-metadata.xml |
| Compose BOM | **2026.09.00** | https://dl.google.com/dl/android/maven2/androidx/compose/compose-bom/maven-metadata.xml |
| CameraX (camera-core/camera2/lifecycle/view) | **1.6.2** stable | https://dl.google.com/dl/android/maven2/androidx/camera/group-index.xml |
| kotlinx-coroutines-test / -core | **1.11.0** | Maven Central |
| OkHttp + mockwebserver3 | **5.5.1** | Maven Central |
| Roborazzi (+ roborazzi-compose) | **1.79.0** | GitHub + Maven Central |
| Robolectric | **4.18** (needs ≥ 4.10-alpha-1) | Maven Central |
| Maestro CLI | **cli-2.12.1** (not a Gradle dependency) | GitHub releases |

`gradle/libs.versions.toml` (minimal):

```toml
[versions]
agp = "9.5.1"
kotlin = "2.4.21"
composeBom = "2026.09.00"
camerax = "1.6.2"
coroutinesTest = "1.11.0"
okhttp = "5.5.1"
roborazzi = "1.79.0"
robolectric = "4.18"

[libraries]
camera-core = { group = "androidx.camera", name = "camera-core", version.ref = "camerax" }
camera-camera2 = { group = "androidx.camera", name = "camera-camera2", version.ref = "camerax" }
camera-lifecycle = { group = "androidx.camera", name = "camera-lifecycle", version.ref = "camerax" }
camera-view = { group = "androidx.camera", name = "camera-view", version.ref = "camerax" }
compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "composeBom" }
compose-ui-test-junit4 = { group = "androidx.compose.ui", name = "ui-test-junit4" }
compose-ui-test-manifest = { group = "androidx.compose.ui", name = "ui-test-manifest" }
coroutines-test = { group = "org.jetbrains.kotlinx", name = "kotlinx-coroutines-test", version.ref = "coroutinesTest" }
okhttp = { group = "com.squareup.okhttp3", name = "okhttp", version.ref = "okhttp" }
mockwebserver3 = { group = "com.squareup.okhttp3", name = "mockwebserver3", version.ref = "okhttp" }
roborazzi-compose = { group = "io.github.takahirom.roborazzi", name = "roborazzi-compose", version.ref = "roborazzi" }
robolectric = { group = "org.robolectric", name = "robolectric", version.ref = "robolectric" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-compose = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
roborazzi = { id = "io.github.takahirom.roborazzi", version.ref = "roborazzi" }
```

Module `app/build.gradle.kts` (dependencies only):

```kotlin
plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.roborazzi)
}

dependencies {
    implementation(platform(libs.compose.bom))
    implementation(libs.camera.core)
    implementation(libs.camera.camera2)
    implementation(libs.camera.lifecycle)
    implementation(libs.camera.view)

    testImplementation(libs.coroutines.test)
    testImplementation(libs.okhttp)
    testImplementation(libs.mockwebserver3)
    testImplementation(libs.robolectric)
    testImplementation(libs.roborazzi.compose)

    androidTestImplementation(platform(libs.compose.bom))
    androidTestImplementation(libs.compose.ui.test.junit4)
    debugImplementation(libs.compose.ui.test.manifest)
}
```

Notes:
- AGP 9.x and Gradle 9.9.1 with JDK 17+ is the expected pairing; the exact minimum Gradle for AGP 9.5.1 is **UNVERIFIED** — the wrapper at 9.9.1 is newer than any minimum we would expect. Check the AGP release notes if sync fails.
- The `org.jetbrains.kotlin.plugin.compose` plugin version follows Kotlin (2.4.21).
- Robolectric needs `@GraphicsMode(GraphicsMode.Mode.NATIVE)` on screenshot test classes.

---

## 6. Video and frame sources for the demo app

Build the app with a `FrameSource` chosen at runtime (build flavour or hidden setting):

| Source | When | Notes |
|---|---|---|
| `CameraXFrameSource` | Real phone, emulator camera | Real path. Test manually. |
| `VideoFileFrameSource` | Recorded POV clip on device | Decode with `MediaMetadataRetriever` (standard Android API) at fixed fps. Same clip every run. |
| `ImageFrameSource` | Single scenario frame | Looping still. Good for a decision-only test. |
| `FakeFrameSource` | JVM tests | Canned list. |

Recorded-video mode: the demo can run from the phone's storage with no camera. Audio, backend, and the nudge logic stay live. Keep the flag in the debug menu, not in the store build.

---

## 7. Offline fallback and 36-hour checklist

### 7.1 Offline fallback design

- **Cached decisions:** store each backend response keyed by `(clipId, frameIndex)` or by a perceptual hash of the frame. Persist to Room or a JSON file in app storage. Write-through on every live call.
- **Replay mode:** read decisions from the cache in frame order, no network. The nudge logic runs unchanged. Use it when Wi-Fi or the API fails.
- **Failure policy:** backend timeout (e.g. 2 s) → use the cached answer for that clip position if present; else stay silent and log `Log.w("NudgeCoord", "no decision")`. Never show an error screen on stage.
- **TTS offline:** TextToSpeech voice data can be installed in advance; **UNVERIFIED** which voices work offline on each test phone. Test with airplane mode on.

### 7.2 Checklist (T-minus = hours before the live demo)

| T-minus | Task | Done when |
|---|---|---|
| T-36 | Freeze Decisions prompt set (questions and thresholds) | Written into the repo, tagged |
| T-36 | Record 10–15 POV clips (see `04-test-media.md`) and one "walk" clip | Files on both phones and the laptop, absolute paths in a run note |
| T-34 | Build debug APK, install on emulator and both phones with `-g` | `adb shell dumpsys package` shows CAMERA granted |
| T-32 | Emulator run with `-camera-back imagefile:` for each scenario image | Screenshots in `docs/research/glasses/emulation/` or scratchpad |
| T-30 | Phone camera live check (CameraX source), USB and Wi-Fi debugging | Live nudge on a real plate of food, logcat clean |
| T-28 | Maestro smoke flow green on emulator and one phone | JUnit XML saved, screenshots present |
| T-26 | Permission denial path: deny, "Only this time", revoke | App shows the explanation, does not crash |
| T-24 | Recorded-video mode run, full length, on each phone | Nudges match the recorded expectations |
| T-22 | Offline run: airplane mode, cached decisions only | Nudges appear from cache; TTS audible |
| T-20 | Backend health and quota check: one live Decisions call, key not in APK (`apk` grep for the key name, not the value) | 200 OK, latency logged |
| T-18 | Latency budget measured end to end (frame → spoken nudge) | p90 under the agreed target |
| T-16 | Battery > 80 %, screen timeout set to max, notifications off, Do Not Disturb on | Checked on each phone |
| T-12 | Code freeze. Tag the release build. Keep the previous APK. | Tag exists |
| T-10 | Full dress rehearsal on the demo phone and the presenter's laptop | One clean run, screen recorded (scrcpy `--record` **UNVERIFIED** flag, or `adb shell screenrecord`) |
| T-6 | Hotspot backup tested (phone tethering) | Backend reachable from hotspot |
| T-3 | Charge all devices and cables; second USB cable packed | Checked |
| T-1 | Final run: app launched, scenario queued, volume up, camera pointed at the scene | Nudge heard |
| T-0 | Live demo. Fallback order: live camera → recorded video → cached replay → screen recording | Agreed with presenter before stage |

Demo-day rules:
- Never update the app during the last 12 hours.
- Keep one spare phone with the same APK installed.
- Keep the USB cable connected to the laptop only for logs, not for power in the middle of a live run.

---

## 8. Remaining risk and open checks

| Risk | Check | Owner |
|---|---|---|
| `videofile:` loop behaviour | Play a 20 s clip for 60 s on the emulator | Dev |
| `android emulator start` accepts camera flags | `android emulator start <name>` vs `emulator -avd` with `-camera-back` | Dev |
| CameraX test artifacts | Confirm the artifact name on Google Maven before using any CameraX fake | Dev |
| scrcpy camera mirroring conflicts with our CameraX preview | Test once on the phone | Dev |
| Real phone in the T3 device tools | Use `device_list` on the phone | Agent |
| TTS offline voices | Test per phone | Dev |

---

## 9. Sources

Android emulator
- https://developer.android.com/studio/run/emulator-use-camera (virtual scene, Extended controls)
- https://developer.android.com/studio/run/emulator-commandline (`-camera-back` modes, headless flags, `-gpu`, `-no-window`)
- https://developer.android.com/studio/releases/emulator (environment mode 36.6.11; latest stable 37.2.12)
- https://developer.android.com/studio/run/emulator-snapshots (snapshots unreliable with software rendering)
- https://developer.android.com/tools/agents (Android CLI overview, commands list)
- https://developer.android.com/tools/agents/android-cli/commands/emulator_create (`android emulator create` syntax)

Real phones
- https://developer.android.com/tools/adb (wireless debugging, `adb pair`/`adb connect`, `adb tcpip 5555`)
- https://developer.android.com/tools/logcat (filter syntax, buffers)
- https://developer.android.com/training/permissions/requesting (runtime permissions, one-time camera permission, `adb install -g`, `dumpsys`, `pm clear-permission-flags`)
- https://github.com/Genymobile/scrcpy (v5.0.1; README feature list)
- https://github.com/Genymobile/scrcpy/blob/master/doc/camera.md (camera mirroring, Android 12+)

Automated tests
- https://developer.android.com/develop/ui/compose/testing , https://developer.android.com/develop/ui/compose/testing/common-patterns (`createComposeRule`)
- https://developer.android.com/agents/skills/camera/camerax/references/testing (CameraX testing; conflicting artifact name, see 3.3)
- https://github.com/takahirom/roborazzi (setup, record/verify/compare, Robolectric note)
- https://github.com/mobile-dev-inc/maestro/releases (cli-2.12.1)
- https://docs.maestro.dev/maestro-cli/ , https://docs.maestro.dev/maestro-cli/how-to-install-maestro-cli.md , https://docs.maestro.dev/maestro-cli/maestro-cli-commands-and-options.md , https://docs.maestro.dev/reference/commands-available/takescreenshot.md

Versions (checked 2026-11-14)
- https://services.gradle.org/versions/current (Gradle 9.9.1)
- https://dl.google.com/dl/android/maven2/com/android/tools/build/gradle/maven-metadata.xml (AGP)
- https://repo1.maven.org/maven2/org/jetbrains/kotlin/kotlin-gradle-plugin/maven-metadata.xml (Kotlin)
- https://dl.google.com/dl/android/maven2/androidx/compose/compose-bom/maven-metadata.xml (Compose BOM)
- https://dl.google.com/dl/android/maven2/androidx/camera/group-index.xml (CameraX)
- https://repo1.maven.org/maven2/org/jetbrains/kotlinx/kotlinx-coroutines-test/maven-metadata.xml (coroutines-test 1.11.0)
- https://repo1.maven.org/maven2/com/squareup/okhttp3/mockwebserver3/maven-metadata.xml (OkHttp 5.5.1)
- https://repo1.maven.org/maven2/org/robolectric/robolectric/maven-metadata.xml (Robolectric 4.18)

Project files
- `docs/README.md` (Direction B architecture: native Kotlin, key on backend)
- `docs/research/glasses/emulation/04-test-media.md` (clip list for section 7)
- `.claude/skills/gemini-api-dev/SKILL.md` ("Decisions API" section)
