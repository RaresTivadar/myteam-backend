const User = require('../models/User');
const Team = require('../models/Team'); 
const bcrypt = require('bcryptjs');

exports.signupUser = async (req, res) => {
  const { email, team } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ error: 'Email already exists!' });
    }

    const user = new User(req.body);

    if (team) {
      await Promise.all(team.map(async (teamId) => {
        const team = await Team.findById(teamId);
        if (!team) {
          throw new Error(`Team not found for ID: ${teamId}`);
        }
        if (user.role === 'coach') {
          team.coaches.push(user._id);
        } else if (user.role === 'player') {
          team.players.push(user._id);
        }
        await team.save();
      }));
    }
    await user.save();


    res.status(201).send({ user, message: 'User registered successfully' });
  } catch (error) {
    res.status(500).send({ error: 'Internal server error', details: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send({ error: 'Login failed!' });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).send({ error: 'Login failed!' });
    }

    res.send({ user });
  } catch (error) {
    res.status(500).send(error);
  }
};
exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    delete updates.role;

    const user = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true });
    
    if (!user) {
      return res.status(404).send({ error: 'User not found.' });
    }

    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};
exports.deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
      const user = await User.findByIdAndDelete(userId);
      if (!user) {
          return res.status(404).send({ message: "User not found." });
      }

      await Team.updateMany(
          { },
          { $pull: { coaches: userId, players: userId } }
      );

      res.send({ message: "User successfully deleted." });
  } catch (error) {
      res.status(500).send({ message: "Error deleting user", error: error.message });
  }
};
exports.getUserDetails = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).populate('team');
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
};
exports.assignTeamToUser = async (req, res) => {
  const { userId, teamId } = req.params;

  try {
    const user = await User.findById(userId);
    const team = await Team.findById(teamId);

    if (!user || !team) {
      return res.status(404).send({ error: 'User or team not found' });
    }

    if (!user.team.includes(team._id)) {
      user.team.push(team._id); 
      await user.save();
    }

    if (user.role === 'coach' && !team.coaches.includes(user._id)) {
      team.coaches.push(user._id);
    } else if (user.role === 'player' && !team.players.includes(user._id)) {
      team.players.push(user._id);
    }

    await team.save();

    res.status(200).send({ message: 'Team added to user successfully', user });
  } catch (error) {
    res.status(500).send({ error: 'Internal server error', details: error });
  }
};
exports.removeTeamFromUser = async (req, res) => {
  const { userId, teamId } = req.params;

  try {
      const user = await User.findById(userId);
      const team = await Team.findById(teamId);

      if (!user || !team) {
          return res.status(404).send({ error: 'User or team not found' });
      }

      user.team = user.team.filter(id => !id.equals(teamId));
      await user.save();

      if (user.role === 'coach') {
        team.coaches = team.coaches.filter(id => !id.equals(userId));
      } else if (user.role === 'player') {
        team.players = team.players.filter(id => !id.equals(userId));
      }
      await team.save();

      res.status(200).send({ message: 'Team removed from user successfully', user });
  } catch (error) {
      res.status(500).send({ error: 'Internal server error', details: error });
  }
};
exports.getUserTeams = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('team');
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    res.status(200).send({team: user.team });
  } catch (error) {
    res.status(500).send({ error: 'Internal server error', details: error.message });
  }
};
