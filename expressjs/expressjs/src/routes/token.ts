import * as TokenController from "../controllers/token"

const express = require('express')

const router = express.Router()

router.get('/refreshAccessToken', TokenController.refreshAccessToken)

export default router
