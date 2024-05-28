import { Audio } from 'expo-av';
import { useEffect, useState } from "react";
import { Text, StyleSheet, View } from "react-native";
import { initWhisper, AudioSessionIos } from 'whisper.rn'

export default function () {
    const [permissionResponse, requestPermission] = Audio.usePermissions();

    const requestRecordingPermission = async () => {
        if (permissionResponse?.status !== 'granted') {
            console.log('Requesting permission..');
            await requestPermission();
        }
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
        });
    }

    const initListener = async () => {
        console.log("start init whisper");

        const whisperContext = await initWhisper({
            filePath: require('../assets/whisper/ggml-small.bin'),
        });

        console.log("start realtime transcribe");

        const { stop, subscribe } = await whisperContext.transcribeRealtime({
            realtimeAudioSec: 10,
            realtimeAudioSliceSec: 5
        });

        subscribe(evt => {
            const { isCapturing, data, processTime, recordingTime } = evt
            console.log(
                `Realtime transcribing: ${isCapturing ? 'ON' : 'OFF'}\n` +
                // The inference text result from audio record:
                `Result: ${data?.result}\n\n` +
                `Process time: ${processTime}ms\n` +
                `Recording time: ${recordingTime}ms`,
            )
            if (!isCapturing) console.log('Finished realtime transcribing')
        })

        console.log('init listener');
    }

    useEffect(() => {
        console.log("model path", require('../assets/whisper/ggml-small.bin'));
        console.log("icon path", require('../assets/images/icon.png'));

        requestRecordingPermission().then(() => {
            // initListener();
        }).catch((error) => {
            console.error("Failed to request recording permission", error);
        });
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.floatingBall}></View>
            <View style={styles.responseContainer}>
                <Text style={styles.statusText}>[贾维斯正在聆听...]</Text>
                <Text style={styles.inputText}>来听我弹吉他吧，你听这段旋律怎么样</Text>
                <Text style={styles.outputText}>听起来很不错，尤其是开头那段泛音的部分，简直绝了！</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        position: 'relative',
        backgroundColor: '#000000'
    },
    floatingBall: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#66ccff',
        shadowColor: '#336688',
        shadowOffset: {
            width: 3,
            height: 3
        },
        shadowOpacity: 0.7,
        shadowRadius: 4,
        position: 'absolute',
        bottom: 30,
        right: 30
    },
    responseContainer: {
        position: 'absolute',
        bottom: 30,
        right: 75,
        borderRadius: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        shadowColor: 'rgba(255, 255, 255, 0.1)',
        shadowOffset: {
            width: 3,
            height: 3
        },
        shadowOpacity: 0.7,
        shadowRadius: 4,
        padding: 5
    },
    statusText: {
        color: '#cecece'
    },
    inputText: {
        color: '#efefef'
    },
    outputText: {
        color: '#cceeff'
    },
    baseText: {
        fontFamily: 'Cochin',
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});