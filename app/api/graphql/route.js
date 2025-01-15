import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import dbConnect from '../../../utils/dbConnect';
import typeDefs from '../../../graphql/typeDefs';
import resolvers from '../../../graphql/resolvers';

// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers
});

// Ensure MongoDB is connected before handling requests
const handler = startServerAndCreateNextHandler(server, {
  context: async () => {
    await dbConnect();
    return {}; // No custom context needed yet
  },
});

export { handler as GET, handler as POST }; // Support both GET and POST requests
