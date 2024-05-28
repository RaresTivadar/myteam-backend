const User = require('../models/User');
const Team = require('../models/Team'); 
const bcrypt = require('bcryptjs');

exports.signupUser = async (req, res) => {
  const { email, password, role, accessCode } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ error: 'Email already exists!' });
    }

    const user = new User(req.body);

    if (role === 'player' && accessCode) {
      const team = await Team.findOne({ accessCode });
      if (!team) {
        return res.status(400).send({ error: 'Invalid access code' });
      }
      team.players.push(user._id);
      await team.save();
      user.team = team._id;
    }

    await user.save();
    res.status(201).send({ user, message: 'User registered successfully' });
  } catch (error) {
    res.status(500).send({ error: 'Internal server error', details: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ error: 'Login failed! User not found.' });
    }

    if (password !== user.password) {
      return res.status(400).send({ error: 'Login failed! Invalid password.' });
    }

    res.send({ user });
  } catch (error) {
    console.error('Login error:', error); 
    res.status(500).send({ error: 'Internal server error' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    if (updates.birthdate) {
      const selectedDate = new Date(updates.birthdate);
      const currentDate = new Date();
      if (selectedDate > currentDate) {
        return res.status(400).send({ error: 'Birthdate cannot be in the future' });
      }
    }

    const user = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true });
    
    if (!user) {
      return res.status(404).send({ error: 'User not found.' });
    }

    res.send(user);
  } catch (error) {
    res.status(400).send({ error: 'Failed to update user', details: error.message });
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
    res.status(200).send({ team: user.team });
  } catch (error) {
    res.status(500).send({ error: 'Internal server error', details: error.message });
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
};
exports.getAllUsersAttendance = async (req, res) => {
  try {
    const users = await User.find({ role: 'player' });
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
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