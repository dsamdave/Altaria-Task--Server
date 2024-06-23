
import express from 'express'
import comingSoonCtrl from '../contollers/comingSoonCtrl'


const router = express.Router()

router.post('/coming-soon', comingSoonCtrl.addComingSoonMsg)
router.get('/coming-soon', comingSoonCtrl.getAllComingSoonMsg)








export default router