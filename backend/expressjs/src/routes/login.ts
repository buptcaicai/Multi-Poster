import * as LoginController from "~/controllers/login"
import { verifyBearer } from "~/middlewares/bearerAuth"

const express = require('express')

const router = express.Router()

router.post('/login', LoginController.passwordLogin)
router.post('/logout', verifyBearer, LoginController.logout)

export default router