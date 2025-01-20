import { gql } from "@apollo/client";

export const SIGNUP_MUTATION = gql`
  mutation Signup($email: String!, $username: String!, $password: String!) {
    signup(email: $email, username: $username, password: $password) {
    user {
      id
      username
    }
    token
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
    user {
      id
      username
      }
      token
    }
  }
`;

export const CREATE_CHARACTER_MUTATION= gql`
  mutation CreateCharacter($userId: ID!, $name: String!, $class: String!) {
    createCharacter(userId: $userId, name: $name, class: $class) {
      id
      name
  }
}
`

export const DELETE_CHARACTER_MUTATION = gql`
  mutation DeleteCharacter($characterId: ID!) {
    deleteCharacter(characterId: $characterId)
}
`

export const SET_ACTIVE_CHARACTER_MUTATION= gql`
  mutation SetActiveCharacter($characterId: ID!) {
    setActiveCharacter(characterId: $characterId) {
    id
    username
    email
  }
}`