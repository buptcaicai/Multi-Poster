import { verifyAdmin } from "../middlewares/accessTokenAuth"
import * as UserController from "../controllers/users"

const express = require('express')

const router = express.Router()

router.get('/getAllUsers', verifyAdmin, UserController.getAllUsers)

export default router
