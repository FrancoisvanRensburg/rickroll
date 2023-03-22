import { Text, View } from "react-native";
import { Table, Row, Rows } from "react-native-table-component";

export interface Detections {
  first_frame: number;
  last_frame: number;
  detected_frames: number;
  type: string;
  average_frame_confidence: number;
  prevalence: number;
  value: number;
  confidence: number;
  top_left_x_y: string;
  bottom_right_x_y: string;
}
export interface ITableDetection {
  detections?: Detections[] | null;
  frames?: Frames[] | null;
  fps: number;
  timing: number;
  device: string;
}
export interface Frames {
  sequence: number;
  detections?: Detections[] | null;
}

function DetectionTable({ data }: { data: ITableDetection }) {
  const header = ["Type", "Confidence"];

  function getDataToDisplay() {
    if (data.detections) {
      return data.detections.map(detection => {
        return [detection.type, detection.average_frame_confidence];
      });
    }
  }

  return (
    <View style={{ marginTop: 200 }}>
      <Text style={{ fontSize: 18 }}>GeeksforGeeks React Native Table</Text>
      <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
        <Row data={header} />
        <Rows data={getDataToDisplay()} />
      </Table>
    </View>
  );
}

export default DetectionTable;
