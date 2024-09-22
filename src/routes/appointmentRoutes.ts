

import express from 'express'
import auth from '../middleware/auth'
import appointmentCtrl from '../contollers/appointmentsCtrl'
import { validateBookingAppointment } from '../middleware/validations/appointmentValidations'


const router = express.Router()

router.get('/appointments', auth, appointmentCtrl.getAllAppointments)

router.get('/appointments/next', auth, appointmentCtrl.getNextAppointments)

router.get('/appointments/past', auth, appointmentCtrl.getPastAppointments)

router.get('/appointments/:id', auth, appointmentCtrl.getOneAppointment)

router.get('/user-appointments', auth, appointmentCtrl.getUserAppointments)

router.post('/appointments', auth, validateBookingAppointment, appointmentCtrl.bookAppointment)

router.put('/accept-appointment/:id', auth, appointmentCtrl.acceptAppointment)

router.put('/decline-appointment/:id', auth, appointmentCtrl.declineAppointment)

router.delete('/delete-appointment/:id', auth, appointmentCtrl.deleteAppointment)

router.get('/appointments/status/:status', auth, appointmentCtrl.getAppointmentsByStatus)

router.put('/update-appointments-status/:id', auth, appointmentCtrl.updateAppointmentStatus)








export default router