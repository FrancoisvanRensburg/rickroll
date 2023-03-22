import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Camera, CameraType } from "expo-camera";
import { Video } from "expo-av";
import axios, { AxiosRequestConfig } from "axios";
import * as FileSystem from "expo-file-system";
import { LinearProgress, Button } from "react-native-elements";
import DetectionTable from "../components/Table";

const VideoRecorder = (): JSX.Element => {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [recording, setRecording] = useState<boolean>(false);
  const [video, setVideo] = useState<string | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [recordingEnabled, setRecordingEnabled] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [resData, setResData] = useState<any>(null);

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
    setUploadError(null);
    if (!video) {
      setIsUploading(false);
      return;
    }
    const fileUri = video;

    FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64
    })
      .then(binaryData => {
        setRecordingEnabled(false);
        const formData = new FormData();
        formData.append("file", binaryData);

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
            if (res.status === 200) {
              setUploadProgress(1);
              setVideo(null);
              setRecording(false);
              setResData(res.data);
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

  const roundDown = (num: number, precision: number) => {
    precision = Math.pow(10, precision);
    return Math.floor(num * precision) / precision;
  };

  if (!recordingEnabled) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {uploadError && (
          <View
            style={{
              backgroundColor: "rgba(214, 61, 57, 0.1)",
              padding: 12
            }}
          >
            <Text style={{ color: "rgba(214, 61, 57, 1)" }}>Error uploading: {uploadError}</Text>
          </View>
        )}

        {isUploading && (
          <View>
            <Text>Uploading video...</Text>
            <Text>{roundDown(uploadProgress * 100, 2)}%</Text>
            <LinearProgress
              style={{ marginVertical: 20 }}
              value={uploadProgress}
              variant="determinate"
            />
          </View>
        )}

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
        {resData && (
          <View>
            {/*  @ts-ignore*/}
            <DetectionTable data={data} />
          </View>
        )}
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
            useNativeControls
          />
        ) : (
          <Camera ref={cameraRef} style={{ flex: 1 }} type={type} />
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
            <TouchableOpacity style={{ padding: 30 }} onPress={async () => await uploadVideo()}>
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
