

import express from 'express'
import auth from '../middleware/auth'
import appointmentCtrl from '../contollers/appointmentsCtrl'
import { validateBookingAppointment } from '../middleware/validations/appointmentValidations'


const router = express.Router()

router.get('/appointments', auth, appointmentCtrl.getAllAppointments)

router.get('/admin-appointments/next', auth, appointmentCtrl.getNextAppointmentsAdmin)

router.get('/appointments/next', auth, appointmentCtrl.getNextAppointments)

router.get('/appointments/past', auth, appointmentCtrl.getPastAppointments)

router.get('/appointments/:id', auth, appointmentCtrl.getOneAppointment)

router.get('/user-appointments', auth, appointmentCtrl.getUserAppointments)

router.post('/appointments', auth, validateBookingAppointment, appointmentCtrl.bookAppointment)

router.post('/accept-appointment/:id', auth, appointmentCtrl.acceptAppointment)

router.post('/decline-appointment/:id', auth, appointmentCtrl.declineAppointment)

router.delete('/delete-appointment/:id', auth, appointmentCtrl.deleteAppointment)

router.get('/appointments/status/:status', auth, appointmentCtrl.getAppointmentsByStatus)

router.post('/update-appointments-status/:id', auth, appointmentCtrl.updateAppointmentStatus)




router.get('/auth/zoom', appointmentCtrl.authZoom)
 
router.get('/callback', appointmentCtrl.zoomCallBack)

router.get('/zoom-refreshToken', appointmentCtrl.zoomRefreshToken)

router.post('/zoom-refreshToken', appointmentCtrl.saveZoomRefreshToken)

router.get('/get-meeting-link', appointmentCtrl.getMeetingLink)









export default router