"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
router.post('/getUsers', userController_1.getUser);
/* User Auth */
router.post('/sendConfirmationEmail', userController_1.sendConfirmationEmail);
router.post('/checkRegistrationToken', userController_1.checkRegistrationToken);
router.post('/login', userController_1.login);
router.post('/checkUserAuth', userController_1.checkUserAuth);
exports.default = router;
