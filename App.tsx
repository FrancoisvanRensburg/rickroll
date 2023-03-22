import { Alert, SafeAreaView } from "react-native";
import client from "./apollo/client";
import CharacterList from "./components/CharacterList";
import { ApolloProvider } from "react-apollo";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/Home";
import VideoUploaderCheck from "./screens/VideoUploaderScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      {/*// @ts-ignore*/}
      <ApolloProvider client={client}>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Overview" }} />
          <Stack.Screen name={"CharacterList"} component={CharacterList} />
          {/*<Stack.Screen name={"VideoUploader"} component={VideoUploaderScreen} />*/}
          <Stack.Screen name={"VideoUploader"} component={VideoUploaderCheck} />
        </Stack.Navigator>
        {/*<SafeAreaView>*/}
        {/*  <CharacterListRework />*/}
        {/*</SafeAreaView>*/}
      </ApolloProvider>
    </NavigationContainer>
  );
}
