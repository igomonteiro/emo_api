import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../schemas/Users';
import { loginValidation } from '../services/validation';

class SessionController {
  async newSession(req, res) {
    // Schema validation
    if(!(await loginValidation(req.body))) {
      return res.status(400).json({ error: 'Login validation fails' });
    }
    
    const user = await User.findOne({ email: req.body.email });

    if(!user) {
      return res.status(400).json({ error: 'Email or password is wrong.' });
    }
  
    const validPass = await bcrypt.compare(req.body.password, user.password);

    if(!validPass) {
      res.status(400).json({ error: 'Email or password is wrong.' });
    }

    const { id, name, email } = user;
    
    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, process.env.TOKEN_SECRET, { expiresIn: '7d'}),
    });
  }
}

export default new SessionController();