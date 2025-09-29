const express = require('express');
const DashboardController = require('../controllers/dashboardController');
const { requireAuth } = require('../middlewares/auth');

const router = express.Router();

// Rutas del dashboard
router.get('/', requireAuth, DashboardController.getDashboard);
router.post('/api/support-event', requireAuth, DashboardController.handleSupportEvent);

module.exports = router;