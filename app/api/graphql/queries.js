import { gql } from "@apollo/client";

export const ME_QUERY = gql`
query Me {
  me {
    id
    username
    email
    characters {
      id
      name
      level
      class
    }
    activeCharacter {
      id
      name
      class
      health
      castingResource
      level
      power
      preparedness
      experience
      score
      inventory
      gold
      armor {
        helmet
        chestPiece
        leggings
        boots
        gloves
      }
      progress {
        mobsKilled
        questsCompleted
        gatherings
      }
      potionBag {
        tier1
        tier2
        tier3
        tier4
        tier5
        tier6
        tier7
        tier8
        tier9
        tier10
      }
    }
  }
}
`;