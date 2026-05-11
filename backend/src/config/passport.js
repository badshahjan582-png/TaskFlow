const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require('./db');

module.exports = function(passport) {
  passport.use(new LocalStrategy({
    usernameField: 'email'
  }, async (email, password, done) => {
    try {
      const res = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      if (res.rows.length === 0) {
        return done(null, false, { message: 'Incorrect email or password.' });
      }
      const user = res.rows[0];

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect email or password.' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const res = await db.query('SELECT id, username, email, full_name FROM users WHERE id = $1', [id]);
      if (res.rows.length > 0) {
        done(null, res.rows[0]);
      } else {
        done(new Error('User not found'));
      }
    } catch (err) {
      done(err);
    }
  });
};
