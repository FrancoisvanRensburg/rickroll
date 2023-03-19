import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Camera, CameraType } from "expo-camera";
import { Video } from "expo-av";
import axios, { AxiosRequestConfig } from "axios";

const VideoRecorder = (): JSX.Element => {
  const [type, setType] = useState(CameraType.back);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [recording, setRecording] = useState<boolean>(false);
  const [video, setVideo] = useState<string | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const startRecording = async () => {
    if (cameraRef.current) {
      setRecording(true);
      const videoData = await cameraRef.current.recordAsync();
      setVideo(videoData.uri);
      setRecording(false);
    }
  };

  const stopRecording = async () => {
    if (cameraRef.current) {
      setRecording(false);
      cameraRef.current.stopRecording();
    }
  };

  function toggleCameraType() {
    setType(type === CameraType.back ? CameraType.front : CameraType.back);
  }

  const uploadVideo = async () => {
    if (!video) {
      return;
    }
    const fileUri = video;
    const fileName = fileUri.split("/").pop();
    const fileType = "video/mp4";

    const formData: any = new FormData();
    // formData.append("file", {
    //   uri: fileUri,
    //   name: fileName,
    //   type: fileType
    // });
    formData.append({
      file: fileUri
    });

    const options: AxiosRequestConfig = {
      onUploadProgress: progressEvent => {
        // @ts-ignore
        const progress = progressEvent.loaded / progressEvent.total;
        setUploadProgress(progress);
      },
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data"
      }
    };

    console.log("form data", JSON.stringify(formData, null, 2));
    console.log("options", options);

    // try {
    //   const response = await axios.post("https://example.com/upload", formData, options);
    //
    //   if (response.status === 200) {
    //     setUploadProgress(1);
    //     setVideo(null);
    //     setRecording(false);
    //   } else {
    //     setUploadProgress(0);
    //   }
    // } catch (error) {
    //   setUploadProgress(0);
    // }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {video ? (
          <Video
            source={{ uri: video }}
            style={{ flex: 1 }}
            // @ts-ignore
            resizeMode="contain"
            // isLooping
            useNativeControls
          />
        ) : (
          <Camera
            ref={cameraRef}
            style={{ flex: 1 }}
            type={type}
            onCameraReady={
              permission ? () => setHasPermission(true) : () => setHasPermission(false)
            }
          />
        )}
      </View>
      <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
        {video ? (
          <>
            <TouchableOpacity
              style={{ padding: 30 }}
              onPress={() => {
                setVideo(null);
                // checkPermission();
              }}
            >
              <Text>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ padding: 30 }}
              onPress={async () => {
                await uploadVideo();
              }}
            >
              <Text>Upload</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {recording ? (
              <TouchableOpacity style={{ padding: 30 }} onPress={stopRecording}>
                <Text>Stop Recording</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={{ padding: 30 }} onPress={startRecording}>
                <Text>Record</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={{ padding: 30 }} onPress={toggleCameraType}>
              <Text>Flippit</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

export default VideoRecorder;
