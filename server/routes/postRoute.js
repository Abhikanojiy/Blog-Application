const express=require('express');
const router=express.Router();

const { verifyuser } = require('../utils/verifyuser');
const {Createpost, deletepost, updatepost}=require('../controller/postController');
const {getpostafter}=require('../controller/postController');


router.post('/create',verifyuser,Createpost);
router.get('/getpost',getpostafter);
router.delete('/delete/:postId/:userId',verifyuser,deletepost);
router.put('/update/:postId/:userId',verifyuser,updatepost)




module.exports=router