const Event = require('../models/Event');

exports.createEvent = async (req, res) => {
    try {
      const event = new Event(req.body);
      await event.save();
      res.status(201).send(event);
    } catch (error) {
      res.status(400).send({ error: 'Failed to create event', details: error.message });
    }
  };  

exports.updateEvent = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'eventType', 'date', 'location', 'score', 'description', 'attendees', 'latitude', 'longitude', 'stadium', 'teams'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).send();
    }

    updates.forEach(update => event[update] = req.body[update]);
    await event.save();
    res.send(event);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).send();
    }
    res.send({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getEventsByType = async (req, res) => {
  try {
    const events = await Event.find({ eventType: req.params.type }).populate('attendees.user');
    res.send(events);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getAttendancesForUser = async (req, res) => {
  try {
    const events = await Event.find({ 'attendees.user': req.params.userId });
    const attendances = events.map(event => ({
      eventId: event.id,
      name: event.name,
      date: event.date,
      status: event.attendees.find(att => att.user.toString() === req.params.userId).status
    }));
    res.send(attendances);
  } catch (error) {
    res.status(500).send({ error: 'Failed to retrieve attendance', details: error.message });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({}).populate('attendees.user');
    res.send(events);
  } catch (error) {
    res.status(500).send(error);
  }
};
exports.getEventsByTeam = async (req, res) => {
    try {
      const { teamId } = req.params;
      const events = await Event.find({ team: teamId }).populate('attendees.user');
      res.send(events);
    } catch (error) {
      res.status(500).send({ error: 'Failed to retrieve events for team', details: error.message });
    }
  };
  