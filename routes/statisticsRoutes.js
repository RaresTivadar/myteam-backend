const express = require('express');
const statisticsController = require('../controllers/statisticsController');
const router = express.Router();

router.post('/', statisticsController.createStatistics);
router.patch('/statistics/:id', statisticsController.updateStatistics);
router.get('/:userId', statisticsController.getStatisticsByUser);
router.delete('/:id', statisticsController.deleteStatistics);

module.exports = router;
