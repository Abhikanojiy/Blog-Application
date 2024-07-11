const { errorhandler } = require("../utils/errorhandler")
const Comment =require('../model/commentmodel')

const createcomment=async(req,res,next)=>{
const {content,postId,userId}=req.body
console.log(userId)
if(userId!==req.user._id){
    return next(errorhandler(403,'you are not allowed to comment'));
}
try{
    const createdcomment=  new Comment({
        content,
        postId,
        userId
    })
    await createdcomment.save();
    res.status(200).json(createdcomment);
}catch(error){
    next(error);
}

}

const getcomment=async (req,res,next)=>{
    
try{
const find=await  Comment.find({postId:req.params.postId}).sort({
    createdAt:-1
})
res.status(200).json(find);
}catch(error){
next(error);
}
}

const getlike=async(req,res,next)=>{
const comment=await Comment.findById(req.params.commentId);
if(!comment){
    return next(errorhandler(404,'comment not found'));

}
try{
    const userIndex=comment.likes.indexOf(req.user._id);
    if(userIndex===-1){
        comment.numberOfLikes+=1;
        comment.likes.push(req.user._id);
    }else{
        comment.numberOfLikes-=1;
        comment.likes.splice(userIndex,1);
    }
    await comment.save();
    res.status(200).json(comment)
}catch(error){
    next(error);
}
}


module.exports={createcomment,getcomment,getlike}