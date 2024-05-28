const express = require('express');
const rankingController = require('../controllers/rankingController');
const router = express.Router();

router.post('/', rankingController.createRanking);
router.get('/coach/:coachId', rankingController.getRankingsByCoach);
router.get('/', rankingController.getAllRankings);
router.patch('/:id', rankingController.updateRanking);
router.delete('/:id', rankingController.deleteRanking);

module.exports = router;
