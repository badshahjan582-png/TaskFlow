const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const validate = require('../middleware/validate');
const { createTeamSchema, addMemberSchema } = require('../validators/teamValidator');
const { ensureAuthenticated } = require('../middleware/auth');

router.use(ensureAuthenticated);

router.post('/', validate(createTeamSchema), teamController.createTeam);
router.get('/', teamController.getMyTeams);
router.get('/:id', teamController.getTeamDetails);
router.put('/:id', validate(createTeamSchema), teamController.updateTeam);
router.delete('/:id', teamController.deleteTeam);
router.post('/:id/members', validate(addMemberSchema), teamController.addMember);

module.exports = router;
