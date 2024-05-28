const Ranking = require('../models/Ranking');

exports.createRanking = async (req, res) => {
  try {
    const ranking = new Ranking(req.body);
    await ranking.save();
    res.status(201).send(ranking);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getRankingsByCoach = async (req, res) => {
  try {
    const { coachId } = req.params;
    const rankings = await Ranking.find({ coach: coachId });
    res.send(rankings);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch rankings', details: error.message });
  }
};

exports.updateRanking = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['team', 'matchesPlayed', 'goalsScored', 'goalsReceived', 'points'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const ranking = await Ranking.findById(req.params.id);
    if (!ranking) {
      return res.status(404).send();
    }

    updates.forEach((update) => ranking[update] = req.body[update]);
    await ranking.save();
    res.send(ranking);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deleteRanking = async (req, res) => {
  try {
    const ranking = await Ranking.findByIdAndDelete(req.params.id);
    if (!ranking) {
      return res.status(404).send();
    }
    res.send(ranking);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getAllRankings = async (req, res) => {
  try {
    const rankings = await Ranking.find({});
    res.status(200).send(rankings);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch rankings', details: error.toString() });
  }
};

