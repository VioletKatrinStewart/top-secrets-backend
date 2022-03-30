const bcryptjs = require('bcryptjs');
const User = require('../models/User');

module.exports = class UserService {
  static async create({ username, password }) {
    const passwordHash = bcryptjs.hashSync(
      password,
      Number(process.env.SALT_ROUNDS)
    );
    return User.insert({
      username,
      passwordHash,
    });
  }

  static async signIn({ username, password }) {
    const user = await User.findByUsername(username);
    if (!user) throw new Error('invalid username or password');

    const passwordsMatch = bcryptjs.compareSync(password, user.passwordHash);
    if (!passwordsMatch) throw new Error('invalid username or password');

    return user;
  }
};
