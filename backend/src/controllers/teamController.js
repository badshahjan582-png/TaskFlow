const teamService = require('../services/teamService');

const createTeam = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const team = await teamService.createTeam(name, description, req.user.id);
    res.status(201).json(team);
  } catch (error) {
    next(error);
  }
};

const getMyTeams = async (req, res, next) => {
  try {
    const teams = await teamService.getTeamsForUser(req.user.id);
    res.status(200).json(teams);
  } catch (error) {
    next(error);
  }
};

const getTeamDetails = async (req, res, next) => {
  try {
    const teamId = parseInt(req.params.id);
    
    const isMember = await teamService.isTeamMember(teamId, req.user.id);
    if (!isMember) {
      return res.status(403).json({ message: 'Access denied. You are not a member of this team.' });
    }

    const team = await teamService.getTeamById(teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    const members = await teamService.getTeamMembers(teamId);
    
    res.status(200).json({ ...team, members });
  } catch (error) {
    next(error);
  }
};

const addMember = async (req, res, next) => {
  try {
    const teamId = parseInt(req.params.id);
    const { email, role } = req.body;

    const isAdmin = await teamService.isTeamAdmin(teamId, req.user.id);
    if (!isAdmin) {
      return res.status(403).json({ message: 'Only team admins can add members.' });
    }

    const newMember = await teamService.addMemberToTeam(teamId, email, role || 'member');
    res.status(200).json({ message: 'Member added successfully', member: newMember });
  } catch (error) {
      if (error.message.includes('duplicate key value violates unique constraint')) {
          return res.status(400).json({ message: 'User is already in this team.' });
      }
    next(error);
  }
};

const updateTeam = async (req, res, next) => {
    try {
        const teamId = parseInt(req.params.id);
        const { name, description } = req.body;
        const isAdmin = await teamService.isTeamAdmin(teamId, req.user.id);
        if (!isAdmin) {
            return res.status(403).json({ message: 'Only team admins can update this team.' });
        }
        const updated = await teamService.updateTeam(teamId, name, description);
        res.status(200).json(updated);
    } catch (err) {
        next(err);
    }
}

const deleteTeam = async (req, res, next) => {
    try {
        const teamId = parseInt(req.params.id);
        const isAdmin = await teamService.isTeamAdmin(teamId, req.user.id);
        if (!isAdmin) {
            return res.status(403).json({ message: 'Only team admins can delete this team.' });
        }
        await teamService.deleteTeam(teamId);
        res.status(200).json({message: 'Team deleted.'});
    } catch (err) {
        next(err);
    }
}

module.exports = {
  createTeam,
  getMyTeams,
  getTeamDetails,
  addMember,
  updateTeam,
  deleteTeam
};
