import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import dbConnect from '../../../utils/dbConnect';
import typeDefs from '../../../graphql/typeDefs';
import resolvers from '../../../graphql/resolvers';
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
      return { user: null }; 
    }

    const token = authHeader.replace('Bearer ', '');
    try {
      const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
      return { user: decodedUser }; 
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return { user: null }; 
    }
  },
});


export { handler as GET, handler as POST }; 
