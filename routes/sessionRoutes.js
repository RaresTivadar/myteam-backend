const express = require('express');
const sessionController = require('../controllers/sessionController');
const router = express.Router();

router.post('/', sessionController.createSession);
router.get('/user/:userId', sessionController.getSessionsByUser);
router.patch('/:id', sessionController.updateSession);
router.delete('/:id', sessionController.deleteSession);

module.exports = router;