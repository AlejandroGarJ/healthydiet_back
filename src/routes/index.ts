import { Router } from 'express';
import { checkRegistrationToken, checkUserAuth, getUser, login, sendConfirmationEmail } from '../controllers/userController'

const router = Router();

router.post('/getUsers', getUser);

/* User Auth */
router.post('/sendConfirmationEmail', sendConfirmationEmail);
router.post('/checkRegistrationToken', checkRegistrationToken);
router.post('/login', login);
router.post('/checkUserAuth', checkUserAuth);


export default router;