import { StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";
import { Camera, CameraType } from "expo-camera";
import { Video } from "expo-av";
import { useState, useRef } from "react";

function VideoUploaderScreen() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [camera, setCamera] = useState<any>(null);
  const [record, setRecord] = useState(null);
  const video = useRef(null);
  const [status, setStatus] = useState({});

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraType() {
    setType(type === CameraType.back ? CameraType.front : CameraType.back);
  }

  async function takeVideo() {
    if (camera) {
      const data = await camera.recordAsync({
        maxDuration: 10
      });
      setRecord(data.uri);
      console.log(data.uri);
    }
  }

  async function stopVideo() {
    if (camera) {
      camera.stopRecording();
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <Camera ref={ref => setCamera(ref)} style={styles.fixedRatio} type={type} ratio={"4:3"} />
      </View>
      <Video
        ref={video}
        style={styles.video}
        source={{
          uri: record ?? ""
        }}
        useNativeControls
        // @ts-ignore
        resizeMode="contain"
        isLooping
        onPlaybackStatusUpdate={status => setStatus(() => status)}
      />
      <Button title="Take video" onPress={() => takeVideo()} />
      <Button title="Stop Video" onPress={() => stopVideo()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  cameraContainer: {
    flex: 1,
    flexDirection: "row"
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1
  },
  video: {
    alignSelf: "center",
    width: 350,
    height: 220
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  }
});

export default VideoUploaderScreen;
