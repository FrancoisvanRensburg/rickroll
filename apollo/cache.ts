import { InMemoryCache } from "@apollo/client";
import { ICharacter, ICharacters } from "./Intarfaces";

/**
 * cahce module is used here to concat the
 * old data with new data during pagination
 */
export const cache: InMemoryCache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        characters: {
          keyArgs: ["filter"],
          merge(existing: ICharacters, incoming: ICharacters) {
            let results: ICharacter[] = [];
            if (existing && existing.results.length > 0) {
              results = results.concat(existing.results);
            }
            if (incoming && incoming.results.length > 0) {
              results = results.concat(incoming.results);
            }
            return {
              ...incoming,
              results
            };
          }
        }
      }
    }
  }
});
