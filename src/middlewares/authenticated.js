import jwt from 'jsonwebtoken';
import authConfig from '../config/auth';

export default function authenticated(req, res, next) {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.json({ error: 'JWT token is missing.' });
  }

  // Bearer token
  const [, token] = authHeader.split(' ');

  try {
    const decoded = jwt.verify(token, authConfig.jwt.secret);
    const { id } = decoded;
    
    req.user = {
      id: id,
    }

    return next();
  } catch(err) {
    return res.json({ error: 'Invalid jwt token.' });
  }
}