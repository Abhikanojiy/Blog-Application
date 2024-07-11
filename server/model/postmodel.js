const mongoose=require('mongoose');


const postschema=new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    Content:{
        type:String,
        minlength: 100,
        required:true
    },
    title:{
        type:String,
        required:true,
        unique:true
    },
    image:{
        type:String,
        default:'https://wallpapercave.com/wp/wp2036002.jpg'
    },
    category:{
        type:String,
        default:'uncategorized'
    },
    slug:{
        type:String,
        required:true,
        unique:true
    },
},
{timestamps:true})

const Post=mongoose.model('Post',postschema);

module.exports=Post