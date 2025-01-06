



import express from 'express'
import authCtrl from '../contollers/authCtrl';
// import auth from '../middleware/auth'


const router = express.Router()


router.post('/example',  authCtrl.example);






export default router