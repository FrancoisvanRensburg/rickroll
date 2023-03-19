export interface ICharacter {
  id: string;
  name: string;
  image: string;
  species?: string;
  gender?: string;
  episode?: IEpisode[];
  status?: string;
}

export interface ICharacters {
  results: ICharacter[];
  info: IInfo;
}

export type CharactersQueryType = {
  characters: ICharacters;
};

export type CharacterQueryType = {
  character: ICharacter;
};
export interface IEpisode {
  id?: string;
  name: string;
  air_date: string;
  episode?: string;
}
interface IInfo {
  next: number;
  count: number;
  pages: number;
}
