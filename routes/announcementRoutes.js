const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');

router.post('/', announcementController.createAnnouncement);
router.get('/team/:teamId', announcementController.getAllAnnouncements); // Updated to include teamId
router.patch('/:id', announcementController.updateAnnouncement);
router.delete('/:id', announcementController.deleteAnnouncement);

module.exports = router;
