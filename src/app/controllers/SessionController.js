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

    const { _id } = user;

    return res.json({
      token: jwt.sign({ _id }, process.env.TOKEN_SECRET, { expiresIn: process.env.EXPIRES_IN}),
    });
  }

  async getUserLoggedIn(req, res) {
    const { _id, name, email } = await User.findById(req.user._id);
    return res.json({
      user: {
        _id,
        name,
        email
      }
    });
  }
}

export default new SessionController();