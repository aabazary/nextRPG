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

export const COMPLETE_GATHER_TASK_MUTATION = gql`
mutation CompleteGatheringTask($characterId: ID!, $tier: Int!, $successful: Boolean!) {
  completeGatheringTask(characterId: $characterId, tier: $tier, successful: $successful)
}
`

export const COMPLETE_MOB_TASK_MUTATION = gql`
mutation CompleteMobBattle($characterId: ID!, $tier: Int!, $successful: Boolean!) {
  completeMobBattle(characterId: $characterId, tier: $tier, successful: $successful)
}
`

export const USE_POTION_MUTATION = gql`
mutation UsePotion($characterId: ID!, $tier: Int!) {
  usePotion(characterId: $characterId, tier: $tier)
}
`

export const COMPLETE_BOSS_TASK_MUTATION =gql`
mutation CompleteBossBattle($characterId: ID!, $tier: Int!, $successful: Boolean!) {
  completeBossBattle(characterId: $characterId, tier: $tier, successful: $successful)
}
`

export const PURCHASE_POTION_MUTATION = gql`
mutation PurchasePotion($characterId: ID!, $tier: Int!, $quantity: Int!) {
  purchasePotion(characterId: $characterId, tier: $tier, quantity: $quantity)
}
`