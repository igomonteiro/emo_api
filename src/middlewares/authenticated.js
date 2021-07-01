import jwt from 'jsonwebtoken';

export default function authenticated(req, res, next) {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.json({ error: 'JWT token is missing.' });
  }

  // Bearer token
  const [, token] = authHeader.split(' ');

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = decoded;
    
    return next();
  } catch(err) {
    return res.json({ error: 'Invalid jwt token.' });
  }
}