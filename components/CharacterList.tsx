import React, { useState } from "react";
import { View, FlatList, ActivityIndicator } from "react-native";
import { Text, Avatar } from "react-native-elements";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import client from "../ApolloClient";

const CHARACTERS_QUERY = gql`
  query Characters($page: Int!) {
    characters(page: $page) {
      info {
        count
        pages
        next
        prev
      }
      results {
        id
        name
        species
        image
      }
    }
  }
`;

interface Character {
  id: string;
  name: string;
  species: string;
  image: string;
}

const renderItem = ({ item }: { item: Character }) => (
  <View style={{ flexDirection: "row", alignItems: "center" }}>
    <Avatar
      rounded
      source={{
        uri: item.image
      }}
      size="medium"
    />
    <View style={{ marginLeft: 10 }}>
      <Text>{item.name}</Text>
      <Text>{item.species}</Text>
    </View>
  </View>
);

const CharacterList: React.FC = () => {
  const [page, setPage] = useState(1);

  const { loading, error, data, fetchMore } = useQuery(CHARACTERS_QUERY, {
    client,
    variables: { page },
    fetchPolicy: "cache-and-network"
  });

  const handleLoadMore = () => {
    if (!data.characters.info.next) return;
    setPage(page + 1);
  };

  if (loading && page === 1) {
    return <ActivityIndicator size="large" />;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <FlatList
      data={data.characters.results}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={data.characters.info.next && <ActivityIndicator size="large" />}
    />
  );
};

export default CharacterList;
