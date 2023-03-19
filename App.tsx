import { SafeAreaView } from "react-native";
import client from "./apollo/client";
import CharacterListRework from "./components/CharacterListRework";
import { ApolloProvider } from "react-apollo";

export default function App() {
  return (
    // @ts-ignore
    <ApolloProvider client={client}>
      <SafeAreaView>
        <CharacterListRework />
      </SafeAreaView>
    </ApolloProvider>
  );
}
