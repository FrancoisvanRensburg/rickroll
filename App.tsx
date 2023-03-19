import { useState } from "react";
import { Button, FlatList, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

export default function App() {
  const [value, setValue] = useState("Useless Placeholder");
  const [list, setList] = useState<string[]>([]);
  function goalInputHandler(enteredText: string) {
    setValue(enteredText);
  }

  function addGoalHandler() {
    if (value === "") {
      return;
    }
    setList(currentList => [...currentList, value]);
    setValue("");
  }

  return (
    <View style={styles.appContainer}>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder={"Sup yo!"}
          style={styles.textInput}
          value={value}
          onChangeText={goalInputHandler}
        />
        <Button title={"Add goal!"} onPress={addGoalHandler} />
      </View>
      <View style={styles.goalsContainer}>
        <FlatList
          data={list}
          renderItem={itemData => {
            return <Text style={styles.goalItem}>{itemData.item}</Text>;
          }}
        ></FlatList>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    paddingTop: 50,
    paddingHorizontal: 16,
    flex: 1
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: 24,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc"
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#cccccc",
    width: "70%",
    paddingLeft: 8,
    marginRight: 8,
    height: 40
  },
  goalsContainer: {
    flex: 5
  },
  goalItem: {
    margin: 8,
    borderRadius: 6,
    backgroundColor: "#5e0acc",
    color: "#ffffff",
    padding: 8
  }
});
