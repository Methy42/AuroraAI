# Installation
npm install
npx expo prebuild

Download model form https://huggingface.co/ggerganov/whisper.cpp/tree/main to local path in assets/models/whisper.cpp/xxxx.bin

## Android
Add proguard rule if it's enabled in project (android/app/proguard-rules.pro):
```
# whisper.rn
-keep class com.rnwhisper.** { *; }
```
For build, it's recommended to use ndkVersion = "24.0.8215888" (or above) in your root project build configuration for Apple Silicon Macs. Otherwise please follow this trobleshooting issue.