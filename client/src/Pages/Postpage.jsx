import { Spinner ,Button} from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { Link, useParams, } from 'react-router-dom'
import Commentsec from '../Components/Commentsec';
import PostCard from '../Components/PostCard';

const Postpage = () => {
    const { postSlug }=useParams();
    const[post,setpost]=useState(null);
    const[loading,setloading]=useState(false);
    const[error,seterrror]=useState(false);
    const [postcard,setPostCard]=useState(null);

    useEffect(()=>{
      const fetchrecent=async()=>{
        try{
          const res=await fetch('/api/post/getpost?limit=3');
          const data=await res.json();
          if(res.ok){
            setPostCard(data.posts);
          }
        }catch(error){
          console.log(error.message);
        }
        
      }
      fetchrecent();
    },[])
    
    useEffect( ()=>{
        
        
    
        const fetchPosts= async ()=> { 
            
            setloading(true);
            try{
            const res=await fetch(`/api/post/getpost?slug=${postSlug}`)
        const data=await res.json();
        if(!res.ok){
            setloading(false);
            seterrror(true);
            return;
            
        }
        if(res.ok){
            setloading(false);
            seterrror(false);
            setpost(data.posts[0]);
        }
       
    }catch(error){
        seterrror(true);
        setloading(false);
    }
}
fetchPosts();
    },[postSlug])
    
    if (loading)
        return (
          <div className='flex justify-center items-center min-h-screen'>
            <Spinner size='xl' />
          </div>
        );
        
  return (
   
   
    <main className='max-w-6xl min-h-screen mx-auto p-3 flex flex-col'>
        <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>
            {post&&post.title}</h1>
            <Link
        to={`/search?category=${post && post.category}`}
        className='self-center mt-5'
      >
        <Button color='gray' pill size='xs'>
          {post && post.category}
        </Button>
      </Link>
      <img
        src={post && post.image}
        alt={post && post.title}
        className='mt-10 p-3 max-h-[600px] w-full object-cover'
      />
      <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs'>
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className='italic'>
          {post && (post.Content.length / 1000).toFixed(0)} mins read
        </span>
      </div>
      <div
        className='p-3 max-w-2xl mx-auto w-full post-content'
        dangerouslySetInnerHTML={{ __html: post && post.Content }}
      ></div>
      
      <Commentsec postId={ post && post._id}/>
      <div className='flex flex-col items-center justify-center mb-5'>
        <h1 className='text-xl mt-5'>
          Recent Articles
        </h1>
        <div className='flex flex-wrap gap-5 mt-5 justify-center'>
          {postcard&&postcard.map((post)=>(
            <PostCard key={post._id} post={post}/>
          ))}
        </div>
      </div>
   </main>
   
   
  )
}

export default Postpage
