import { gql } from "@apollo/client";

export const ME_QUERY = gql`
  query Me {
    me {
    id
    username
    email
    activeCharacter {
      id
      name
      class
    }
    characters {
      id
      name
      level
      class
    }
  }
  }
`;