const mongoose=require('mongoose');

const userschema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true

    },
    password:{
        type:String,
        required:true
    }, 
    photo:{
        type:String,
        default:"https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG.png"
    }, 
    isAdmin:{
        type:Boolean,
        default:false,
    }
},
{timestamps:true}
)

const User=mongoose.model('User',userschema);

module.exports=User