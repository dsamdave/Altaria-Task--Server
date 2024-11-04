

import express from 'express'
import auth from '../middleware/auth'
import userCtrl from '../contollers/userCtrl'
import adminCtrl from '../contollers/adminCtrl';


const router = express.Router()

router.get('/analytics', auth, adminCtrl.getAnalytics);
router.get('/export-waitlist', auth, adminCtrl.exportWaitLIst);






export default router