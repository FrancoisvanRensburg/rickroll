import { SafeAreaView } from "react-native";
import client from "./apollo/client";
import { ApolloClient } from "@apollo/client";
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

// const styles = StyleSheet.create({
//   appContainer: {
//     paddingTop: 50,
//     paddingHorizontal: 16,
//     flex: 1
//   },
//   inputContainer: {
//     flex: 1,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginRight: 24,
//     alignItems: "center",
//     borderBottomWidth: 1,
//     borderBottomColor: "#cccccc"
//   },
//   textInput: {
//     borderWidth: 1,
//     borderColor: "#cccccc",
//     width: "70%",
//     paddingLeft: 8,
//     marginRight: 8,
//     height: 40
//   },
//   goalsContainer: {
//     flex: 5
//   },
//   goalItem: {
//     margin: 8,
//     borderRadius: 6,
//     backgroundColor: "#5e0acc",
//     color: "#ffffff",
//     padding: 8
//   }
// });
