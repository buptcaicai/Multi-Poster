import * as PostController from "~/controllers/posts"
import * as LoginController from "~/controllers/login"
import { verifyBearer } from "~/middlewares/bearerAuth"

const express = require('express')

const router = express.Router()

router.get('/getAllPosts', verifyBearer, PostController.getAllPosts)
router.post('/addPost', verifyBearer, PostController.addPost)

export default router