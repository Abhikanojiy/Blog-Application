import React, { useEffect, useState } from 'react'
import {useSelector} from 'react-redux'
import {Link} from 'react-router-dom'
import { Textarea,Button,Alert } from 'flowbite-react'
import Comment from '../Components/Comment'



const Commentsec = ({postId}) => {
    const {currentUser}=useSelector((state)=>state.user);
    
    const [comment, setComment] = useState('');
    const [comments,setcomments]=useState([]);
    const[commentError,setcommentError]=useState(false);
const handleLike=async(commentId)=>{
  try {
    if (!currentUser) {
      navigate('/sign-in');
      return;
    }
    const res = await fetch(`https://blog-application-one-snowy.vercel.app/api/comment/likecomment/${commentId}`, {
      method: 'PUT',
    });
    if (res.ok) {
      const data = await res.json();
      setcomments(
        comments.map((comment) =>
          comment._id === commentId
            ? {
                ...comment,
                likes: data.likes,
                numberOfLikes: data.likes.length,
              }
            : comment
        )
      );
    }
  } catch (error) {
    console.log(error.message);
  }
}
    const handleSubmit=async (e)=>{
      e.preventDefault();
      try{
        const res=await fetch('https://blog-application-one-snowy.vercel.app/api/comment/create',{
          method:'POST',
          headers:{
            'Content-Type':'application/json'
          },
          body:JSON.stringify({
            content:comment,
            postId,
            userId:currentUser._id
          })
          
        })
        const data=await res.json();
        if(res.ok){
          setComment('');
          setcommentError(false);
          setcomments([data,...comments])
        
        }
      }catch(error){
setcommentError(error.message)
      }
    }
    useEffect(()=>{
      const fetchcomment=async()=>{
        try{
          const res=await fetch(`https://blog-application-one-snowy.vercel.app/api/comment/getting/${postId}`)
          
          if(res.ok){
            const data=await res.json();
            setcomments(data);
          }
        }catch(error){
          console.log(error.message)
        }
      }
      fetchcomment();
    },[postId])
  return (
    <div className='max-w-2xl mx-auto w-full p-3'>
      {currentUser?(
        <div  className='flex items-center gap-1 my-5 text-gray-500 text-sm' >
           <p>Signed in as:</p>
    <img 
        className='h-5 w-5 object-cover rounded-full'
        src={currentUser.photo}/>
          <Link
            to={'/dashboard?tab=profile'}
            className='text-xs text-cyan-600 hover:underline'
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className='text-sm text-teal-500 my-5 flex gap-1'>
          You must be signed in to comment.
          <Link className='text-blue-500 hover:underline' to={'/sign-in'}>
            Sign In
          </Link>
        </div>
      )}
        {currentUser && (
        <form
          onSubmit={handleSubmit}
          className='border border-teal-500 rounded-md p-3'
        >
          <Textarea
            placeholder='Add a comment...'
            rows='3'
            maxLength='200'
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className='flex justify-between items-center mt-5'>
            <p className='text-gray-500 text-xs'>
              {200 - comment.length} characters remaining
            </p>
            <Button outline gradientDuoTone='purpleToBlue' type='submit'>
              Submit
            </Button>
          </div>
          {/* {commentError && (
            <Alert color='failure' className='mt-5'>
              {commentError}
            </Alert>
          )} */}
        </form>)}
        {comments.length === 0 ? (
        <p className='text-sm my-5'>No comments yet!</p>
      ) : (
        <>
          <div className='text-sm my-5 flex items-center gap-1'>
            <p>Comments</p>
            <div className='border border-gray-400 py-1 px-2 rounded-sm'>
              <p>{comments.length}</p>
            </div>
          </div>
          {comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onLike={handleLike}
              
              // onDelete={(commentId) => {
              //   setShowModal(true);
              //   setCommentToDelete(commentId);
              // }}
            />
          ))}
        </>
      )}
      </div>
    
  )
}

export default Commentsec
