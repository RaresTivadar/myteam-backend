const Session = require('../models/Session');
const User = require('../models/User');

exports.createSession = async (req, res) => {
    const { user: userId, type, duration, date } = req.body;
  
    try {
        const session = new Session({ type, duration, date, user: userId });
        await session.save();
  
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        user.sessions.push(session._id);

        await user.save();

        res.status(201).send({
            message: 'Session created successfully and added to user',
            session,
            userSessions: user.sessions  
        });
    } catch (error) {
        res.status(500).send({ error: 'Internal server error', details: error.message });
    }
};


exports.getSessionsByUser = async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.params.userId });
    res.status(200).send(sessions);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateSession = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['type', 'duration', 'date'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).send();
    }

    updates.forEach((update) => session[update] = req.body[update]);
    await session.save();
    res.send(session);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deleteSession = async (req, res) => {
  try {
    const session = await Session.findByIdAndDelete(req.params.id);
    if (!session) {
      return res.status(404).send();
    }
    res.send(session);
  } catch (error) {
    res.status(500).send(error);
  }
};