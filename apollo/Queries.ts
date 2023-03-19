import { gql } from "@apollo/client";

export const FETCH_CHARACTERS = gql`
  query fetchCharacters($page: Int, $filter: FilterCharacter) {
    characters(page: $page, filter: $filter) {
      results {
        id
        name
        image
        species
      }
      info {
        next
        count
        pages
      }
    }
  }
`;
