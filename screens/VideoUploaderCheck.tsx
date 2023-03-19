import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, Button } from "react-native";
import { Camera, CameraType } from "expo-camera";
import { Video } from "expo-av";
import axios, { AxiosRequestConfig } from "axios";
import * as FileSystem from "expo-file-system";

const VideoRecorder = (): JSX.Element => {
  const [type, setType] = useState(CameraType.back);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [recording, setRecording] = useState<boolean>(false);
  const [video, setVideo] = useState<string | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={{ flex: 1 }}>
        <Text style={{ textAlign: "center" }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

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
    let binaryData = "";

    FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64
    })
      .then(binaryData => {
        // use the binaryData for your desired purpose
        // console.log("binary data is", binaryData);
        const formData: any = new FormData();
        formData.append("file", {
          // binaryData
          file: binaryData
          // name: fileName,
          // type: fileType
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

        const file = formData._parts[0][1];
        // const { uri } = formData._parts[0][1];
        //
        // let body = {
        //   file: uri
        // };

        console.log("form data", JSON.stringify(formData, null, 2));
        console.log("options", options);

        axios
          .post(
            "https://mvai.qa.onroadvantage.com/api/analyse?models=Passenger%2CFatigueAudio&fps=5&orientation=right",
            formData,
            options
          )
          .then(res => {
            console.log("res", res);
            if (res.status === 200) {
              setUploadProgress(1);
              setVideo(null);
              setRecording(false);
            } else {
              setUploadProgress(0);
            }
          })
          .catch(error => {
            setUploadProgress(0);
            console.log("error response", error);
          });
      })
      .catch(error => {
        console.log(error);
      });

    console.log("uploading video", uploadProgress);

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
