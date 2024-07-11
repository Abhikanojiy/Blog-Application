const express=require('express');


const router=express.Router();
const {test, Deleteuser,signout, getusers,getuser}=require('../controller/userController')
const { verifyuser }=require('../utils/verifyuser')
const{updateuser}=require('../controller/userController')

router.get('/test',test);
router.put('/update/:userId',verifyuser,updateuser);
router.delete('/delete/:userId',verifyuser,Deleteuser);
router.post('/signout', signout);
router.get('/gettingusers',verifyuser,getusers);
router.get('/:userId',getuser);

module.exports=router;