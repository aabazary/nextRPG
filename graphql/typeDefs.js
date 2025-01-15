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
    power: Int!
    defense: Int!
    preparedness: Int!
    inventory: JSON
    armor: Armor
  }

  type Armor {
    helmet: Int!
    chestpiece: Int!
    leggings: Int!
    boots: Int!
    gloves: Int!
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
  }

  scalar JSON
`;

export default typeDefs;
