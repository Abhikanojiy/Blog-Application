import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { FaThumbsUp } from 'react-icons/fa';
import { Button } from 'flowbite-react';

const Comment = ({comment,onLike}) => {
    const {currentUser}=useSelector((state)=>state.user);
    const [user,setuser]=useState({});
    

    useEffect(()=>{
        const getuser=async()=>{
            try{
                const res=await fetch(`https://blog-application-one-snowy.vercel.app/api/user/${comment.userId}`)
                const data=await res.json();
            
                if(res.ok){
                    setuser(data)
                }
           
            }catch(error){
console.log(error.message)
            }
        }
        getuser();
    },[comment])
  return (
    <div className='flex p-4 border-b dark:border-gray-600 text-sm'>
        <div className='flex-shrink-0 mr-3'>
            <img src={user.photo} 
              className='w-10 h-10 rounded-full bg-gray-200'/>
        </div>
        <div  className='flex-1'>
            <div className='flex items-center mb-1'>
            <span className='font-bold mr-1 text-xs truncate'>
            {user ? `@${user.username}` : 'anonymous user'}
          </span>
          <span className='text-gray-500 text-xs'>
            {moment(comment.createdAt).fromNow()}
          </span>
            </div>
            <p  className='text-gray-500 pb-2'>{comment.content}</p>
            <div className='flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2'>
                <button onClick={()=>onLike(comment._id)} className={`text-gray-400 hover:text-blue-500
                    ${
                        currentUser &&comment.likes.includes(currentUser._id) &&!'text-blue-500'}`
                    }
                    >
                    <FaThumbsUp className='text-sm'/>
                </button>
                <p className='text-gray-400'>
                {comment.numberOfLikes > 0 &&
                  comment.numberOfLikes +
                    ' ' +
                    (comment.numberOfLikes === 1 ? 'like' : 'likes')}
              </p>
            </div>
        </div>
      
    </div>
  )
}

export default Comment
