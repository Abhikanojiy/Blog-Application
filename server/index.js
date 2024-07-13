const express=require('express');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const userRouter =require('./routes/userRoute');
dotenv.config();
const authRouter=require('./routes/authRoute');
const cookieparser=require('cookie-parser');
const postRoute=require('./routes/postRoute');
const cors=require('cors');
const commentRoute=require('./routes/commentRoute')
const path=require('path')
// const __dirname = path.resolve();

mongoose.connect(process.env.MONGO)
.then(()=>{
    console.log("mongo connected successfully")
}).catch((err)=>{
    console.log(err);
})
    

const app=express()

app.use(express.json());
app.use(cookieparser());


// Use CORS middleware
// app.use(cors({
//     origin: 'http://localhost:5173', // Frontend origin
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true // Allow credentials (cookies, authorization headers, etc.)
// }));
app.use(cors());





app.use('/api/user',userRouter);
app.use('/api/auth',authRouter);
app.use('/api/post',postRoute);
app.use('/api/comment',commentRoute)


app.use((err,req,res,next)=>{
    const statusCode=err.statusCode||500;
    const message=err.message ||'internal server error';
    res.status(statusCode).json({
        success:false,
        statusCode,
        message,

    })
})




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`);
});