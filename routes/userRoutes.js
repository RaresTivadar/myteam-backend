const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/signup', userController.signupUser);
router.post('/login', userController.loginUser);
router.put('/:userId', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.get('/:userId', userController.getUserDetails);
router.patch('/assign-team/:userId/:teamId', userController.assignTeamToUser);
router.patch('/remove-team/:userId/:teamId', userController.removeTeamFromUser);
router.get('/:userId/teams', userController.getUserTeams);
module.exports = router;
