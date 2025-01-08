
import express from 'express'
import authCtrl from '../contollers/authCtrl';
import {validateLogin, validateRegister } from '../validations/authValidations';

const router = express.Router()


router.post('/register', validateRegister,  authCtrl.register);
router.post('/login', validateLogin,  authCtrl.login);







export default router