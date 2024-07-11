import React, { useState } from 'react'
import {Alert, Button, Label, Spinner, TextInput} from'flowbite-react'
import {Link, useNavigate} from 'react-router-dom'
import {useDispatch,useSelector} from 'react-redux'
import { signInFailure,signInSuccess, signInStart } from '../Redux/user/userslice'
import  Oath  from '../Components/Oath'


const Signin = () => {
  const[formdata,setformdata]=useState({});
  
  const Navigate=useNavigate();
  const dispatch=useDispatch();
  const {loading ,error:errmessage}=useSelector(state=>state.user)
  
 

  const changehandler= (e)=>{
    setformdata({...formdata,[e.target.id]:e.target.value.trim()});
  }

  const submithandler=async (e)=>{
e.preventDefault();
if(!formdata.email||!formdata.password){
 return  dispatch(signInFailure("please fill all the details"));
}
try{
  dispatch(signInStart());
const response=await fetch('/api/auth/signin',{
  method:'POST',
  headers:{
    "Content-Type": "application/json",
  },
  body:JSON.stringify(formdata)
})
const data=await response.json();
console.log(formdata);

if(data.success==false){
   dispatch(signInFailure(data.message));
}


if(response.ok){
  dispatch(signInSuccess(data))
  Navigate("/");
}

}catch(err){
 
  dispatch(signInFailure(err.message));
}
  }

  return (
    <div className='min-h-screen  '>
      <div className='flex max-w-3xl mx-auto flex-col md:flex-row gap-5 p-3 md:items-center mt-32'>
{/* {left} */}
<div className='flex-1 mr-6'>
<Link to='/' className="self-center whitespace-nowrap text-sm
    sm:text-xl font-semibold dark:text-white">
    <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% rounded-lg text-white text-4xl'>
        Avi's
    </span>
    Blog
    </Link>
    <p  className='mt-2 font-serif'>this is the demo project for my resume , here I will share all my updates</p>

      </div>

    
      {/* {right} */}
       
      <div className='flex-1'>
        <div className=''>
          <form className='flex flex-col gap-4' onSubmit={submithandler}>
            
            <div>
            <Label className='mb-2' value="email"/>
            <TextInput
            className='mt-2'
            type='email'
            placeholder='email'
            id='email'
            onChange={changehandler}
            />
            </div>
            <div >
            <Label  value="password"/>
            <TextInput
            className='mt-2'
            type='password'
            placeholder='password'
            id='password'
            onChange={changehandler}
            />
            </div>
            
      <Button type='submit' className='w-full' gradientDuoTone="purpleToPink" disabled={loading} >
        {
        loading?(
          <>
           <Spinner size='sm'/>
        <span className='pl-3'>loading...</span></>
       
        ):(
          'Sign In'
        )}
        
        </Button>
        
        <Oath/>
          </form>
          <div className='flex gap-2 mt-2 text-sm'>
            <span>Didn't have account ? </span>
              <Link to='/signup' className="text-blue-500">
              Sign Up
              </Link>
             
           
          </div>
          
         

        </div>
        {
        errmessage&&(
         <Alert className='mt-2 text-red-500'>
          {errmessage}
         </Alert>)
        }
        
      </div>
      
    </div>
    </div>
  )
}

export default Signin
