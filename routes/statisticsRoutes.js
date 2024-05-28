const express = require('express');
const statisticsController = require('../controllers/statisticsController');
const router = express.Router();

router.post('/', statisticsController.createStatistics);
router.patch('/:id', statisticsController.updateStatistics);
router.get('/:userId', statisticsController.getStatisticsByUser);
router.get('/team/:teamId', statisticsController.getStatisticsByTeam);
router.delete('/:id', statisticsController.deleteStatistics);

module.exports = router;
