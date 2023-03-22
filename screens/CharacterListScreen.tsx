import React from "react";
import { SafeAreaView } from "react-native";
import CharacterList from "../components/CharacterList";
const CharacterListScreen: React.FC = () => {
  return (
    <SafeAreaView>
      <CharacterList />
    </SafeAreaView>
  );
};

export default CharacterListScreen;
