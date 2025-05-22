import * as LoginController from "~/controllers/login"
import { verifyAccessToken } from "~/middlewares/accessTokenAuth"

const express = require('express')

const router = express.Router()

router.post('/login', LoginController.passwordLogin)
router.post('/logout', verifyAccessToken, LoginController.logout)

export default router