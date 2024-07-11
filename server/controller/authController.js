const User=require('../model/usermodel');
const bcryptjs=require('bcryptjs');
const jwt=require('jsonwebtoken');
const {errorhandler}=require('../utils/errorhandler')

  const signup=async (req,res,next)=>{
    const {username,email,password}=req.body;
   
    if(!username||!email||!password){
        return next(errorhandler(400,'All fields are necessary'))
    }

    const hashedpassword=bcryptjs.hashSync(password,8);
    const data= new User({
        username,
        email,
        password:hashedpassword
    })
    try{
        await data.save();
        if(data){
            res.status(200).json({
                message:"new user created successfully"
            })
        }
        
    }catch(err){
       next(err);
    }


}

const signin=async (req,res,next)=>{
const{email,password}=req.body;
if(!email||!password){
    return next(errorhandler(400,'all fields are necessary'))
}
try{
const user=await User.findOne({email});
const validatepassword=bcryptjs.compareSync(password,user.password);
if(!user){
   return next(errorhandler(404,"user not exist")); 
}
if(!validatepassword){
    return next(errorhandler(401,"invalid password"))
}

const token=jwt.sign({_id:user._id,isAdmin:user.isAdmin},process.env.JWT,{
    expiresIn:"30d"
});
const { password:pass, ...rest } = user._doc
res.status(200).cookie('access_token',token,{
    httpOnly:true
}).json(rest)

}catch(err){
next(err);
}
}

const google = async (req, res, next) => {
    const { username, email, photo } = req.body;

    try {
        const findUser = await User.findOne({ email });

        if (findUser) {
            const token = jwt.sign({ id: findUser._id, isAdmin:findUser.isAdmin }, process.env.JWT, {
                expiresIn: '30h'
            });

            const { password, ...rest } = findUser._doc;

            res.status(200)
                .cookie('access_token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production', // Ensure the cookie is secure in production
                    sameSite: 'Strict' // Helps prevent CSRF attacks
                })
                .json(rest);
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

            const newUser = new User({
                username: username.toLowerCase().split(" ").join(""), // Assuming you want to remove spaces
                email,
                password: hashedPassword,
                photo
            });

            await newUser.save();

            const token = jwt.sign({ id: newUser._id }, process.env.JWT, {
                expiresIn: '30h'
            });

            const { password, ...rest } = newUser._doc;

            res.status(201)
                .cookie('access_token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'Strict'
                })
                .json(rest);
        }
    } catch (error) {
        next(error);
    }
};

module.exports = google;


module.exports={signup,signin,google}


