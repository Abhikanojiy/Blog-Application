const { errorhandler } = require("../utils/errorhandler");
const bcrypt = require('bcryptjs');
const User = require('../model/usermodel');
const { sign } = require("jsonwebtoken");

const test = async (req, res) => {
  res.send("router is working");
}

const updateuser = async (req, res, next) => {
  // Corrected param issue
  console.log('req.user.id:', req.user._id); // Debug log
  console.log('req.params.userId:', req.params.userId); // Debug log
  
  if (req.user._id !== req.params.userId) {
    return next(errorhandler(403, 'You are not allowed to update this user'));
  }

  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorhandler(400, 'Password must be at least 6 characters long'));
    }
    req.body.password = bcrypt.hashSync(req.body.password, 10);
  }

  if (req.body.username) {
    // Corrected the condition
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return next(errorhandler(400, 'Username must be between 7 and 20 characters long'));
    }

    if (req.body.username.includes(' ')) {
      return next(errorhandler(400, 'Username should not contain spaces'));
    }
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          photo: req.body.photo,
          password: req.body.password
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return next(errorhandler(404, 'User not found'));
    }

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (err) {
    next(err);
  }
}

const Deleteuser=async(req,res,next)=>{
  if(!req.user.isAdmin&& req.user.id!==req.params.userId){
   return  next(errorhandler(403,'you are not allowed to delete'
    ))
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json('User has been deleted');
  } catch (error) {
    next(error);
  }
}

const signout=async (req,res,next)=>{
try{
res.clearCookie("access_token").status(200).json({
  'message':'signout successfully'
})
}catch(error){
  next(error);  
}
}

const getusers=async (req,res,next)=>{
if(!req.user.isAdmin){
  return next(errorhandler(403,'you are not allowed to access the users'))
}

try {
  const startIndex = parseInt(req.query.startIndex) || 0;
  const limit = parseInt(req.query.limit) || 9;
  const sortDirection = req.query.order === 'asc' ? 1 : -1;
  const users= await User.find()
  .sort({ updatedAt: sortDirection })
          .skip(startIndex)
          .limit(limit)   // Using .lean() to get plain JavaScript objects

          const usersWithoutPassword = users.map((user) => {
            const { password, ...rest } = user._doc;
            return rest;
          });
const totalusers=await User.countDocuments();
  const now = new Date();
    
        const oneMonthAgo = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          now.getDate()
        );
    
        const lastMonthPosts = await User.countDocuments({
          createdAt: { $gte: oneMonthAgo },
        });
    
        res.status(200).json({
          users:usersWithoutPassword,
          totalusers,
          lastMonthPosts,
        });
}catch(error){
next(error);
}
}

const getuser=async(req,res,next)=>{
  try{
const finding=await User.findById(req.params.userId);
const {password,...rest}=finding._doc;
if(!finding){
  return next(errorhandler(400,'user not not found'));

}
res.status(200).json(finding);

  }catch(error){
next(error);
  }
}

module.exports = { test, updateuser,Deleteuser,signout,getusers,getuser };
