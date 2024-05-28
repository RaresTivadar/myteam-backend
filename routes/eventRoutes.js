const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.post('/', eventController.createEvent);
router.patch('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);
router.get('/', eventController.getAllEvents);
router.get('/type/:type', eventController.getEventsByType); 

module.exports = router;
