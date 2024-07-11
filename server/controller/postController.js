const { errorhandler } = require("../utils/errorhandler")
const Post=require('../model/postmodel')
const Createpost=async(req,res,next)=>{
    console.log(req.user._id)
// if(!req.user.isAdmin){
//     return next(errorhandler(403,'you are not allowed to post'))}

    if(!req.body.title||!req.body.Content){
        return next(errorhandler(400,'fill all the details'))
    }
    const slug=req.body.title.split(' ').join('-').toLowerCase().replace('/[^a-zA-Z0-9-]/g', '');

    const newpost= new Post({
        ...req.body,
        slug,
        userId: req.user._id,
    
    })
    try{
        const savedpost=await newpost.save();
        res.status(201).json(savedpost);

    }catch(error){
next(error)
    }


}


const getpostafter=async(req,res,next)=>{

    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === 'asc' ? 1 : -1;
        const posts = await Post.find({
          ...(req.query.userId && { userId: req.query.userId }),
          ...(req.query.category && { category: req.query.category }),
          ...(req.query.slug && { slug: req.query.slug }),
          ...(req.query.postId && { _id: req.query.postId }),
          ...(req.query.searchTerm && {
            $or: [
              { title: { $regex: req.query.searchTerm, $options: 'i' } },
              { content: { $regex: req.query.searchTerm, $options: 'i' } },
            ],
          }),
        })
          .sort({ updatedAt: sortDirection })
          .skip(startIndex)
          .limit(limit);
    
        const totalPosts = await Post.countDocuments();
    
        const now = new Date();
    
        const oneMonthAgo = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          now.getDate()
        );
    
        const lastMonthPosts = await Post.countDocuments({
          createdAt: { $gte: oneMonthAgo },
        });
    
        res.status(200).json({
          posts,
          totalPosts,
          lastMonthPosts,
        });
      } catch (error) {
        next(error);
      }
}

const deletepost=async (req,res,next)=>{
  console.log(req.user.isAdmin )
if(!req.user.isAdmin || req.user._id!==req.params.userId){
  return next(errorhandler(403,'you are not allowed to delete'));
}
try{
await Post.findByIdAndDelete(req.params.postId
)
res.status(200).json('the post have deleted successfully')

}catch(error){
next(error)
}
}

const updatepost=async(req,res,next)=>{
  if(!req.user.isAdmin|| req.user._id!==req.params.userId){
    return next(errorhandler(403,'you are not allowed to update'));
  }

  try{
   const updatedpost= await Post.findByIdAndUpdate(
      req.params.postId,{
        $set:{
          title: req.body.title,
          Content: req.body.Content,
          category: req.body.category,
          image: req.body.image,
        }
      },
      { new: true }
    )
    res.status(200).json(updatedpost);
  }catch(error){
next(error)
  }
}

module.exports={Createpost,getpostafter,deletepost,updatepost}