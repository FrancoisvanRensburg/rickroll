import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Camera, CameraType } from "expo-camera";
import { Video } from "expo-av";
import axios, { AxiosRequestConfig } from "axios";
import * as FileSystem from "expo-file-system";
import { LinearProgress, Button } from "react-native-elements";

const VideoRecorder = (): JSX.Element => {
  const [type, setType] = useState(CameraType.back);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [recording, setRecording] = useState<boolean>(false);
  const [video, setVideo] = useState<string | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [cancelUpload, setCancelUpload] = useState(null);
  const [recordingEnabled, setRecordingEnabled] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    Alert.alert(
      "Permission to access camera is required",
      "We require permission to access your camera to record and upload videos",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "OK",
          onPress: requestPermission
        }
      ],
      { cancelable: false }
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
    setIsUploading(true);
    if (!video) {
      setIsUploading(false);
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
        const formData = new FormData();
        formData.append("file", {
          file: binaryData
        });

        const cancelTokenSource = axios.CancelToken.source();

        const options: AxiosRequestConfig = {
          onUploadProgress: progressEvent => {
            // @ts-ignore
            const progress = progressEvent.loaded / progressEvent.total;
            setUploadProgress(progress);
          },
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data"
          },
          cancelToken: cancelTokenSource.token // add the cancel token to the request options
        };

        // const file = formData._parts[0][1];

        // console.log("form data", JSON.stringify(formData, null, 2));
        // console.log("options", options);

        const request = axios.post(
          "https://mvai.qa.onroadvantage.com/api/analyse?models=Passenger%2CFatigueAudio&fps=5&orientation=right",
          formData,
          options
        );

        // create a cancel function that cancels the request when called
        const cancel = () => {
          cancelTokenSource.cancel("Request cancelled by user");
        };

        request
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
            setUploadError(error.message);
          })
          .then(() => {
            setIsUploading(false);
            setRecordingEnabled(false);
          });

        // return the cancel function to the caller
        return cancel;
      })
      .catch(error => {
        console.log(error);
        setIsUploading(false);
        setUploadError(error.message);
      })
      .then(() => {
        setRecordingEnabled(false);
      });
  };

  const handleUploadCancel = () => {
    console.log("entered here to cancel");
    if (cancelUpload) {
      // @ts-ignore
      cancelUpload();
      setUploadProgress(0);
    }
  };

  const handleUpload = async () => {
    const cancel = await uploadVideo();
    // @ts-ignore
    setCancelUpload(cancel);
  };

  if (!recordingEnabled) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View
          style={{
            backgroundColor: "rgba(214, 61, 57, 0.1)",
            padding: 12
          }}
        >
          <Text style={{ color: "rgba(214, 61, 57, 1)" }}>Error uploading: {uploadError}</Text>
        </View>

        <Button
          title="Record video"
          buttonStyle={{ backgroundColor: "rgba(127, 220, 103, 1)" }}
          containerStyle={{
            height: 40,
            width: 200,
            marginHorizontal: 50,
            marginVertical: 10
          }}
          titleStyle={{
            color: "white",
            marginHorizontal: 20
          }}
          onPress={() => setRecordingEnabled(true)}
        />
      </View>
    );
  }

  if (isUploading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Uploading video...</Text>
        <Text>{uploadProgress * 100}%</Text>
        <LinearProgress
          style={{ marginVertical: 10 }}
          value={uploadProgress}
          variant="determinate"
        />
        <Button
          title="Danger"
          buttonStyle={{ backgroundColor: "rgba(214, 61, 57, 1)" }}
          containerStyle={{
            height: 40,
            width: 200,
            marginHorizontal: 50,
            marginVertical: 10
          }}
          titleStyle={{ color: "white", marginHorizontal: 20 }}
          onPress={handleUploadCancel}
        />
      </View>
    );
  }

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
              onPress={handleUpload}
              // onPress={async () => {
              //   await uploadVideo();
              // }}
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
