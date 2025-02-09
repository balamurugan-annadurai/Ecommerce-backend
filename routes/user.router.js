import express from 'express';
import { accountActivation, changePassword, contactUs, forgotPassword, login, register, verifyString, verifyUserToken } from '../controllers/user.controller.js';
import authMiddleware from '../middleware/authmiddleware.js';

const router = express.Router();

router.post("/register", register)
router.post("/login", login)
router.post("/verifyToken", verifyUserToken);
router.get("/activateaccount", authMiddleware("user"), accountActivation);
router.post("/forgotpassword", forgotPassword);
router.post("/verifystring", verifyString);
router.post("/changepassword", changePassword);
router.post("/sendmail", contactUs)




export default router