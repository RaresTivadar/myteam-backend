const Announcement = require('../models/Announcement');


exports.createAnnouncement = async (req, res) => {
  try {
    const { title, description, teamId } = req.body;
    const newAnnouncement = new Announcement({ title, description, team: teamId });
    await newAnnouncement.save();
    res.status(201).send(newAnnouncement);
  } catch (error) {
    res.status(400).send({ error: 'Failed to create announcement', details: error.message });
  }
};

exports.getAllAnnouncements = async (req, res) => {
  try {
    const { teamId } = req.params;
    console.log('Team ID in backend:', teamId);
    const announcements = await Announcement.find({ team: teamId });
    res.status(200).send(announcements);
  } catch (error) {
    res.status(500).send({ error: 'Failed to get announcements', details: error.message });
  }
};


exports.updateAnnouncement = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['title', 'description'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).send({ error: 'Announcement not found' });
    }

    updates.forEach((update) => announcement[update] = req.body[update]);
    await announcement.save();
    res.send(announcement);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) {
      return res.status(404).send({ error: 'Announcement not found' });
    }
    res.send({ message: 'Announcement deleted successfully' });
  } catch (error) {
    res.status(500).send(error);
  }
};
