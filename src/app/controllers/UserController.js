import User from '../schemas/Users';
import bcrypt from 'bcryptjs';
import { registerValidation, loginValidation } from '../services/validation';

class UserController {

  // Register a new user
  async register(req, res) {
    // Schema Validation
    if(!(await registerValidation(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const emailExists = await User.findOne({ email: req.body.email });

    if(emailExists) {
      return res.status(400).json({ error: 'This email is already registered.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    const { _id, name, email } = await user.save();

    return res.json({
      _id,
      name,
      email,
    });
  }

  // Get all users (needs authentication)
  async getAll(req, res) {
    const { name, email } = await User.find();
    return res.json({
      name,
      email
    });
  }
}

export default new UserController();