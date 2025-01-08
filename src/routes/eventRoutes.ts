
import express from 'express'
import {validateAddEvents  } from '../validations/authValidations';
import auth from '../middleware/auth';
import eventCtrl from '../contollers/eventCtrl';

const router = express.Router()


router.post('/event',  auth, validateAddEvents, eventCtrl.addEvent);
router.get('/event',   eventCtrl.getEventsByLocation);
router.post('/bookmark-event/:eventId',   auth, eventCtrl.bookmarkEvents);

router.get('/bookmarked-events',   auth, eventCtrl.getBookmarked);







export default router