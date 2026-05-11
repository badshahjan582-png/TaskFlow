const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../validators/authValidator');
const { ensureAuthenticated, ensureGuest } = require('../middleware/auth');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { message: 'Too many attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', authLimiter, ensureGuest, validate(registerSchema), authController.register);
router.post('/login', authLimiter, ensureGuest, validate(loginSchema), authController.login);
router.post('/logout', ensureAuthenticated, authController.logout);
router.get('/me', authController.getCurrentUser);

module.exports = router;
