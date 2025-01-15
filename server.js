import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import dbConnect from './utils/dbConnect';
import typeDefs from './graphql/typeDefs.js';
import resolvers from './graphql/resolvers.js';
import jwt from 'jsonwebtoken';

// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Custom authentication context
const context = async ({ req }) => {
  // Ensure MongoDB is connected before handling requests
  await dbConnect();

  const token = req.headers.authorization || '';

  // JWT token verification
  try {
    const decoded = jwt.verify(token, 'your-secret-key'); // Make sure to use a secure secret key in production
    return { user: decoded }; // Add the user to the context
  } catch (error) {
    console.error('Invalid or expired token');
    return {}; // If no valid token, return an empty context
  }
};

// Create a handler for Next.js API routes (support GET and POST)
const handler = startServerAndCreateNextHandler(server, {
  context,
});

export { handler as GET, handler as POST }; // Support both GET and POST requests
