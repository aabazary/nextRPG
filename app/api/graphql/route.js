import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import dbConnect from '../../../utils/dbConnect';
import typeDefs from '../../../graphql/typeDefs';
import resolvers from '../../../graphql/resolvers';
import { createContext } from '@/utils/auth';
import jwt from 'jsonwebtoken';


const server = new ApolloServer({
  typeDefs,
  resolvers
});


const handler = startServerAndCreateNextHandler(server, {
  context: async (req, res) => {
    await dbConnect();

    const authHeader = req.headers.get('authorization') || null;
    if (!authHeader) {
      return { user: null }; // Ensure no user in the context if no token
    }

    const token = authHeader.replace('Bearer ', '');
    try {
      const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
      return { user: decodedUser }; // Populate user in context
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return { user: null }; // Token invalid or expired
    }
  },
});


export { handler as GET, handler as POST }; 
