



import express from 'express'
import notificationCtrl from '../contollers/notificationCtrl';
import auth from '../middleware/auth';


const router = express.Router()

router.post('/create-notification', auth, notificationCtrl.createNotification);

router.get('/get-notification', auth, notificationCtrl.getNotification);







export default router