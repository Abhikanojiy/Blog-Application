import React, { useState } from 'react'
import {Alert, Button, Label, Spinner, TextInput} from'flowbite-react'
import {Link,Navigate, useNavigate} from 'react-router-dom'
import Oath from '../Components/Oath'

const Signup = () => {
  const[formdata,setformdata]=useState({});
  const[errmessage,seterrormessage]=useState(null);
  const[loading,setloading]=useState(false);
  const Navigate=useNavigate();

  const changehandler= (e)=>{
    setformdata({...formdata,[e.target.id]:e.target.value.trim()});
  }

  const submithandler=async (e)=>{
e.preventDefault();
if(!formdata.username||!formdata.email||!formdata.password){
  return seterrormessage('Please fill all the details');
}
try{
  setloading(true);
  seterrormessage(null);
const response=await fetch('/api/auth/signup',{
  method:'POST',
  headers:{
    "Content-Type": "application/json",
  },
  body:JSON.stringify(formdata)
})
const data=await response.json();
console.log(formdata);

if(data.success==false){
  return seterrormessage(data.message)
}


if(response.ok){
  Navigate("/signin");
}
setloading(false);
}catch(err){
 
 seterrormessage(err.message);
 setloading(false);

}
  }

  return (
    <div className='min-h-screen mt-20 '>
      <div className='flex max-w-3xl mx-auto flex-col md:flex-row gap-5 p-3 md:items-center'>
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
            <Label value="username"/>
            <TextInput
            type='text'
            placeholder='username'
            id='username'
            onChange={changehandler}
            />
            </div>
            <div>
            <Label value="email"/>
            <TextInput
            type='email'
            placeholder='email'
            id='email'
            onChange={changehandler}
            />
            </div>
            <div >
            <Label value="password"/>
            <TextInput
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
          'Sign up'
        )}
        
        </Button>
        <Oath/>
         
          </form>
          <div className='flex gap-2 mt-2 text-sm'>
            <span>Already have an account ? </span>
              <Link to='/signin' className="text-blue-500">
              Sign In
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

export default Signup
