import dotenv from 'dotenv';
dotenv.config();

export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'fallback-secret',
  expiresIn: '1d',
};
