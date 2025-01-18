const typeDefs = `#graphql
  type User {
    id: ID!
    email: String!
    characters: [Character]
  }

  type Character {
    id: ID!
    name: String!
    class: String!
    health: Int!
    castingResource: Int!
    level: Int!
    power: Int!
    preparedness: Int!
    experience: Int!
    score: Int!
    inventory: JSON
    gold: Int!
    armor: Armor!
    progress: Progress!
    potionBag: PotionBag!
  }

  type Armor {
    helmet: Int!
    chestPiece: Int!
    leggings: Int!
    boots: Int!
    gloves: Int!
  }

  type Progress {
    mobsKilled: Int!
    questsCompleted: Int!
    gatherings: Int!
  }

  type PotionBag {
    tier1: Int!
    tier2: Int!
    tier3: Int!
    tier4: Int!
    tier5: Int!
    tier6: Int!
    tier7: Int!
    tier8: Int!
    tier9: Int!
    tier10: Int!
  }

  type Auth {
    token: String!
    user: User!
  }

  type Query {
    getUser(id: ID!): User
    getCharacter(id: ID!): Character
    getAllUsers: [User]
    getAllCharacters: [Character]
  }

  type Mutation {
    register(email: String!, password: String!): User
    login(email: String!, password: String!): Auth!
    createCharacter(userId: ID!, name: String!, class: String!): Character
    deleteCharacter(characterId: ID!): String!
    completeGatheringTask(characterId: ID!, tier: Int!, successful: Boolean!): String!
    completeMobBattle(characterId: ID!, tier: Int!, successful: Boolean!): String!
    completeBossBattle(characterId: ID!, tier: Int!, successful: Boolean!): String!
    purchasePotion(characterId: ID!, tier: Int!): String!
    upgradeGear(characterId: ID!, gearType: String!, tier: Int!): String!
  }

  scalar JSON
`;

export default typeDefs;
