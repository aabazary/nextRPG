import jwt from 'jsonwebtoken';
import User from "@/models/User"

export const createContext = async (req) => {
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.replace('Bearer ', '');
  
    if (!token) {
      return { user: null }; 
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      return { user };
    } catch (error) {
      console.error('Invalid token:', error);
      return { user: null }; 
    }
  };

  