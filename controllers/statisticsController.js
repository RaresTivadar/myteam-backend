const Statistics = require('../models/Statistics');
const User = require('../models/User');

exports.createStatistics = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    const stats = new Statistics({ ...req.body, user: userId });
    await stats.save();
    res.status(201).send(stats);
  } catch (error) {
    console.log(error); 
    res.status(500).send({ error: 'Internal server error', details: error.toString() });
  }
};

exports.updateStatistics = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = Object.keys(req.body);
    const allowedUpdates = ['matchesPlayed', 'goals', 'assists'];

    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid updates!' });
    }

    const stats = await Statistics.findById(id);
    if (!stats) {
      return res.status(404).send({ error: 'Statistics not found' });
    }

    updates.forEach((update) => stats[update] = req.body[update]);
    await stats.save();
    res.send(stats);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: 'Failed to update statistics', details: error.toString() });
  }
};

exports.getStatisticsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const stats = await Statistics.findOne({ user: userId });
    if (!stats) {
      return res.status(404).send({ error: 'Statistics not found for this user' });
    }
    res.send(stats);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Failed to fetch statistics', details: error.toString() });
  }
};

exports.deleteStatistics = async (req, res) => {
  try {
    const { id } = req.params;
    const stats = await Statistics.findByIdAndDelete(id);
    if (!stats) {
      return res.status(404).send({ error: 'Statistics not found' });
    }
    res.send({ message: 'Statistics deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Failed to delete statistics', details: error.toString() });
  }
};
