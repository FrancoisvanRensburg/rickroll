import { Text, View, Button } from "react-native";

function HomeScreen({ navigation }: any) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Home Screen</Text>
      <Button title="Character list" onPress={() => navigation.navigate("CharacterList")} />
      <Button title="Video uploader" onPress={() => navigation.navigate("VideoUploader")} />
    </View>
  );
}

export default HomeScreen;
