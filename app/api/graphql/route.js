import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import dbConnect from '../../../utils/dbConnect';
import typeDefs from '../../../graphql/typeDefs';
import resolvers from '../../../graphql/resolvers';


const server = new ApolloServer({
  typeDefs,
  resolvers
});

const handler = startServerAndCreateNextHandler(server, {
  context: async (req, res) => {
    await dbConnect();
    const authHeader = req.headers.get('authorization') || null;
    return {
      authHeader, 
      req,      
    };
  },
});


export { handler as GET, handler as POST }; 
