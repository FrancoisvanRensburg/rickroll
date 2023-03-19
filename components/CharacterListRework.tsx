import { useLazyQuery } from "react-apollo";
import { FETCH_CHARACTERS } from "../apollo/Queries";
import React, { useEffect, useRef, useState } from "react";
import { CharactersQueryType, ICharacter } from "../apollo/Intarfaces";
import { Avatar, Card, Text } from "react-native-elements";
import { ActivityIndicator, FlatList, View } from "react-native";

// <View style={{ flexDirection: "row", alignItems: "center" }}>
//   <Avatar source={{ uri: item.image }} rounded size={"medium"} />
//   <View style={{ marginLeft: 10 }}>
//     <Text>{item.name}</Text>
//     <Text>{item.species}</Text>
//   </View>
// </View>
const CharacterCard = ({ item }: { item: ICharacter }) => (
  // @ts-ignore
  <Card>
    <Card.Title>{item.name}</Card.Title>
    <Card.Divider />
    <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
      <Avatar source={{ uri: item.image }} rounded size={"medium"} />
      <View style={{ marginLeft: 10, flexDirection: "column" }}>
        <View style={{ marginLeft: 10, flexDirection: "row", marginBottom: 5 }}>
          <Text style={{ fontWeight: "bold" }}>Name:</Text>
          <Text>{item.name}</Text>
        </View>
        <View style={{ marginLeft: 10, flexDirection: "row" }}>
          <Text style={{ fontWeight: "bold" }}>Species:</Text>
          <Text>{item.species}</Text>
        </View>
      </View>
    </View>
  </Card>
);

const CharacterListRework: React.FC = () => {
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const flatlistRef = useRef<any>();
  const [getCharacters, { data, fetchMore, loading, error }] = useLazyQuery<CharactersQueryType>(
    FETCH_CHARACTERS,
    {
      variables: {
        page: 1
      }
    }
  );

  useEffect(() => {
    getCharacters();
  }, []);

  /** variables section */
  const queryData = data && data.characters;
  const showNoMoreMessage = queryData && !queryData.info.next && queryData.info.pages > 1;
  const characters = queryData ? queryData.results : null;
  const canLoadMore = queryData && queryData.info.next && !isLoadingMore;

  const loadMoreHandler = async () => {
    if (!canLoadMore || !fetchMore) {
      return null;
    } else {
      setIsLoadingMore(true);
      // @ts-ignore
      await fetchMore({
        variables: {
          page: data?.characters.info.next
        }
      });
      setIsLoadingMore(false);
    }
  };

  // console.log("characters", JSON.stringify(characters, null, 2));

  const renderFooter = () => {
    if (data && isLoadingMore) {
      return <ActivityIndicator size={"large"} />;
    } else if (showNoMoreMessage) {
      return (
        <Text h4 style={{ textAlign: "center" }}>
          No more characters
        </Text>
      );
    }
    return null;
  };

  return (
    <>
      {loading && (
        <Text h4 style={{ textAlign: "center" }}>
          Loading...
        </Text>
      )}
      {error ? (
        <Text h4 style={{ textAlign: "center" }}>
          Error: {error.message}
        </Text>
      ) : (
        // <Text>Will render here</Text>
        <FlatList
          ref={flatlistRef}
          data={characters}
          renderItem={({ item }) => <CharacterCard item={item} />}
          keyExtractor={item => item.id.toString()}
          // onEndReached={() => {
          //   console.log("load more");
          // }}
          onEndReached={loadMoreHandler}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      )}
    </>
  );
};

export default CharacterListRework;
