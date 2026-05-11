const passport = require('passport');
const userService = require('../services/userService');

const register = async (req, res, next) => {
  try {
    const { username, email, password, full_name } = req.body;

    const existingEmail = await userService.getUserByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ message: 'Email is already registered.' });
    }

    const existingUsername = await userService.getUserByUsername(username);
    if (existingUsername) {
      return res.status(400).json({ message: 'Username is already taken.' });
    }

    const newUser = await userService.createUser({ username, email, password, full_name });

    // Automatically log in user after registration
    req.login(newUser, (err) => {
      if (err) return next(err);
      return res.status(201).json({
        message: 'User registered and logged in successfully.',
        user: { id: newUser.id, username: newUser.username, email: newUser.email, full_name: newUser.full_name }
      });
    });

  } catch (error) {
    next(error);
  }
};

const login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(400).json({ message: info ? info.message : 'Invalid credentials' });
    }
    req.login(user, (err) => {
      if (err) return next(err);
      return res.status(200).json({
        message: 'Logged in successfully',
        user: { id: user.id, username: user.username, email: user.email, full_name: user.full_name }
      });
    });
  })(req, res, next);
};

const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy((err) => {
      if (err) return next(err);
      res.clearCookie('connect.sid');
      res.status(200).json({ message: 'Logged out successfully.' });
    });
  });
};

const getCurrentUser = (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({ user: req.user });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
};

module.exports = {
  register,
  login,
  logout,
  getCurrentUser
};
