import * as PostController from "~/controllers/posts"
import { verifyAccessToken } from "~/middlewares/accessTokenAuth"

const express = require('express')
const router = express.Router()

router.get('/getAllPosts', verifyAccessToken, PostController.getAllPosts)
router.post('/addPost', verifyAccessToken, PostController.addPost)

export default router
