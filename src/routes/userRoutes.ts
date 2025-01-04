



import express from 'express'
import auth from '../middleware/auth'
import authCtrl from '../contollers/authCtrl';


const router = express.Router()


router.post('/contact-us',  authCtrl.test);






export default router