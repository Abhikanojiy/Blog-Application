import { Button } from 'flowbite-react'
import React from 'react'
import { AiFillGoogleCircle } from 'react-icons/ai'
import {GoogleAuthProvider,signInWithPopup, getAuth} from 'firebase/auth'
import {app } from '../firebase'
import {useDispatch} from 'react-redux'
import {signInSuccess} from '../Redux/user/userslice'
import {  useNavigate } from 'react-router-dom'


const Oath =  () => {
  const dispatch=useDispatch();
  const navigate=useNavigate();
    const auth = getAuth(app)
    const handlerauthentication=async()=>{
        const provider=new GoogleAuthProvider();
        provider.setCustomParameters({prompt:'select_account'})

        try{
            const resultsFromGoogle = await signInWithPopup(auth, provider)
            console.log(resultsFromGoogle);
            const googledata={
                username:resultsFromGoogle.user.displayName,
                email:resultsFromGoogle.user.email,
                photo:resultsFromGoogle.user.photoURL
            }

            const response=await fetch('api/auth/google',{
              method:'POST',
              headers:{
                'Content-Type':'Application/json'
              },
              body:JSON.stringify(googledata)
            })
            const data =await response.json();

            if(response.ok){
              dispatch(signInSuccess(data));
              navigate('/');
            }
            
        }catch(err){
console.log(err);
        }
    }
  return (
    <div>
      <Button className='w-full text-sm' type='button' gradientDuoTone='purpleToPink' onClick={handlerauthentication}outline>
      <AiFillGoogleCircle className='w-6 h-6 mr-2'/>
        Continue with Google
      
      
      </Button>
    </div>
  )
}

export default Oath
