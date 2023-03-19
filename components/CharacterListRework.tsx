import { useLazyQuery } from "react-apollo";
import { FETCH_CHARACTERS } from "../apollo/Queries";
import React, { useEffect, useRef, useState } from "react";
import { CharactersQueryType, ICharacter } from "../apollo/Intarfaces";
import { Avatar, Card, Text } from "react-native-elements";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";

const CharacterCard = ({ item }: { item: ICharacter }) => (
  // @ts-ignore
  <Card>
    <Card.Title>{item.name}</Card.Title>
    <Card.Divider />
    <View style={styles.characterContainer}>
      <Avatar source={{ uri: item.image }} rounded size={"medium"} />
      <View style={styles.characterInfoContainer}>
        <View style={styles.labelValueContainer}>
          <Text style={styles.label}>Name:</Text>
          <Text>{item.name}</Text>
        </View>
        <View style={styles.labelValueContainer}>
          <Text style={styles.label}>Species:</Text>
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

  const renderFooter = () => {
    if (data && isLoadingMore) {
      return (
        <ActivityIndicator
          size={"large"}
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        />
      );
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
        <View>
          <ActivityIndicator size={"large"} style={{ marginTop: 15 }} />
        </View>
      )}
      {error ? (
        <Text h4 style={{ textAlign: "center" }}>
          Error: {error.message}
        </Text>
      ) : (
        <FlatList
          ref={flatlistRef}
          data={characters}
          renderItem={({ item }) => <CharacterCard item={item} />}
          keyExtractor={item => item.id.toString()}
          onEndReached={loadMoreHandler}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  characterContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  characterInfoContainer: {
    marginLeft: 10,
    flexDirection: "column"
  },
  labelValueContainer: {
    flexDirection: "row",
    marginBottom: 5
  },
  label: {
    fontWeight: "bold"
  }
});

export default CharacterListRework;
