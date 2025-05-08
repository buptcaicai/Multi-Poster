import * as PostController from "~/controllers/posts"
import * as LoginController from "~/controllers/login"

const express = require('express')

const router = express.Router()

router.get('/getAllPosts', PostController.getAllPosts)
router.post('/addPost', PostController.addPost)

export default router