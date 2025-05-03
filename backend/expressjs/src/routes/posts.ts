import * as PostController from "../controllers/posts"

const express = require('express')

const router = express.Router()

router.get('/getStoredPosts', PostController.getAllProducts)

router.post('/addPost', PostController.savePost)

export default router