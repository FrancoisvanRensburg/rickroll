import { SafeAreaView } from "react-native";
import client from "./apollo/client";
import CharacterListRework from "./components/CharacterListRework";
import { ApolloProvider } from "react-apollo";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/Home";
import VideoUploaderScreen from "./screens/VideoUploaderScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      {/*// @ts-ignore*/}
      <ApolloProvider client={client}>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Overview" }} />
          <Stack.Screen name={"CharacterList"} component={CharacterListRework} />
          <Stack.Screen name={"VideoUploader"} component={VideoUploaderScreen} />
        </Stack.Navigator>
        {/*<SafeAreaView>*/}
        {/*  <CharacterListRework />*/}
        {/*</SafeAreaView>*/}
      </ApolloProvider>
    </NavigationContainer>
  );
}
