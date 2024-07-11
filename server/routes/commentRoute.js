
const express=require('express');
const router=express.Router();
const { verifyuser } = require('../utils/verifyuser');
const {createcomment, getcomment,getlike}=require('../controller/commentController')

router.post('/create',verifyuser,createcomment);
router.get('/getting/:postId',getcomment);
router.put('/likecomment/:commentId',verifyuser,getlike)

module.exports=router