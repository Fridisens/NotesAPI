import jwt from 'jsonwebtoken';

export const authMiddleware = () => ({
  before: async (handler) => {
    const token = handler.event.headers.Authorization?.split(' ')[1];

    if (!token) {
      throw new Error('Unauthorized');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      handler.event.user = decoded;
    } catch (error) {
      console.error('Authorization error:', error.message);
      throw new Error('Unauthorized');
    }
  },
});