import * as LoginController from "~/controllers/login"

const express = require('express')

const router = express.Router()

router.post('/login', LoginController.passwordLogin)

export default router