import * as PostController from "~/controllers/posts"
import { verifyBearer } from "~/middlewares/bearerAuth"

const express = require('express')

const router = express.Router()

router.get('/getAllPosts', verifyBearer, PostController.getAllPosts)
router.post('/addPost', verifyBearer, PostController.addPost)

export default router