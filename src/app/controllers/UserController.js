import User from '../schemas/Users';
import bcrypt from 'bcryptjs';
import { registerValidation, updateValidation} from '../services/validation';

class UserController {

  // Register a new user
  async create(req, res) {
    // Schema Validation
    if(!(await registerValidation(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const emailExists = await User.findOne({ email: req.body.email });

    if(emailExists) {
      return res.status(400).json({ error: 'This email is already registered.' });
    }

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    const { _id, name, email } = await user.save();

    return res.json({
      _id,
      name,
      email,
    });
  }

  // Update user
  async update(req, res) {
    // Schema Validation
    if (!(await updateValidation(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { oldPassword } = req.body;
    let user = await User.findById(req.user._id);

    if (oldPassword && !(await user.comparePassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match.' });
    }

    const { _id, name } = await User.findByIdAndUpdate(req.user._id, req.body, {new : true});
    return res.json({
      _id,
      name,
    });
  }
}

export default new UserController();