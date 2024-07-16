import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Users, { IUser } from '../../models/userModel';
import { IReqAuth } from '../../types/express';

const auth = async (req: IReqAuth, res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized Access' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string };

    const user = await Users.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User account does not exist.' });
    }

    req.user = user;
    req.role = user.role;

    if (user.role === 'admin') {
      req.admin = user;
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized Access' });
  }
};

export default auth;
