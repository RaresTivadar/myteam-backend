const Team = require('../models/Team');
const User = require('../models/User');

exports.createTeam = async (req, res) => {
  try {
    const team = new Team(req.body);
    await team.save();
    const coachId = req.body.coaches[0]; 
    const coach = await User.findById(coachId);
    if (coach) {
      coach.team.push(team._id);
      await coach.save();
    }

    res.status(201).send({ team });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getTeams = async (req, res) => {
  try {
    const teams = await Team.find({});
    res.send({ teams });
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getTeamUsers = async (req, res) => {
  try {
    const { teamId } = req.params;
    const team = await Team.findById(teamId).populate('coaches').populate('players');

    if (!team) {
      return res.status(404).send({ message: 'Team not found' });
    }

    res.status(200).send({
      teamName: team.name,
      coaches: team.coaches,
      players: team.players
    });
  } catch (error) {
    res.status(500).send({ message: 'Error fetching team users', error });
  }
};
exports.getTeamUsers = async (req, res) => {
  try {
    const { teamId } = req.params;
    const team = await Team.findById(teamId).populate('coaches').populate('players');

    if (!team) {
      return res.status(404).send({ message: 'Team not found' });
    }

    res.status(200).send({
      coaches: team.coaches,
      players: team.players
    });
  } catch (error) {
    res.status(500).send({ message: 'Error fetching team users', error });
  }
};


exports.updateTeam = async (req, res) => {
  const { teamId } = req.params;
  const updateData = req.body;

  try {
    const team = await Team.findByIdAndUpdate(teamId, updateData, { new: true, runValidators: true });
    if (!team) {
      return res.status(404).send({ error: 'Team not found' });
    }
    res.send(team);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deleteTeam = async (req, res) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);
    if (!team) {
      return res.status(404).send({ message: 'Team not found' });
    }
    res.send({ message: 'Team deleted successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error deleting team', error: error.message });
  }
};

exports.getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find({});
    res.send(teams);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching teams', error: error.message });
  }
};
exports.getTeamById = async (req, res) => {
  try {
    const { teamId } = req.params;
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).send({ error: 'Team not found' });
    }
    res.status(200).send(team);
  } catch (error) {
    res.status(500).send({ error: 'Internal server error', details: error.message });
  }
};
