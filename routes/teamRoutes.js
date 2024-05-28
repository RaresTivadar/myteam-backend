const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');

router.post('/createteams', teamController.createTeam);
router.get('/getteams', teamController.getTeams);
router.get('/:teamId/users', teamController.getTeamUsers);
router.put('/:teamId', teamController.updateTeam);
router.delete('/:id', teamController.deleteTeam);
router.get('/', teamController.getAllTeams);
router.get('/:teamId', teamController.getTeamById);

module.exports = router;
