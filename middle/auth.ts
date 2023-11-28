import jwt, { Secret } from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import { CustomRequest } from './custom';
import dotenv from 'dotenv';

dotenv.config();

const secretKey = process.env.SECRET_KEY as Secret;

export const authenticate = (req: CustomRequest, res: Response, next: NextFunction) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];

  console.log('Received Token:', token);

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized token' });
  }

  try {
    const decoded = jwt.verify(token, secretKey) as { tokenPayload: { userId: number; userType: string } };
    if (decoded.tokenPayload.userType === 'landlord') {
      req.landlordId = decoded.tokenPayload.userId;
      next();
    } else if (decoded.tokenPayload.userType === 'tenant') {
      req.tenantId = decoded.tokenPayload.userId;
      next();
    } else {
      return res.status(403).json({ error: 'Access denied!' });
    }
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Unauthorized error' });
  }
};