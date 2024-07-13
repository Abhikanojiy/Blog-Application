import React, { useEffect, useState } from 'react'
import landingpageImage from '../Components/assets/landingpage.jpg';  // Adjust the path as per your project structure
import PostCard from '../Components/PostCard';
import { Link } from 'react-router-dom';
import { Button } from 'flowbite-react';

const Home = () => {
  const [posts,setposts]=useState('');

  useEffect(()=>{
    const fetchposts=async()=>{
      try{

      
      const res=await fetch('https://blog-application-one-snowy.vercel.app/api/post/getpost');
      const data=await res.json();
      if(res.ok){
        setposts(data.posts);
      }
      
    }catch(error){
      console.log(error.message);
    }
    }
    fetchposts();
  },[])
  return (
    <div className='min-h-screen w-full'>
      <div className='flex flex-row justify-center h-[500px] items-center ' 
      style={{ backgroundImage: `url(${landingpageImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className=' w-[450px] ' >
        <h1 className='text-3xl font-bold lg:text-3xl font-serif text-black text-wrap '>Share Your Passion with the 
        World,<span className='text-green-900'>Create</span> a Blog now</h1>
        <p className='italic  text-gray-700'> Here you'll find a variety of articles and tutorials on topics such as
            web development, software engineering, and programming languages.</p>
       
        </div>
       

      </div>

    {/* // <div>
    // <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto '>
    //   <h1 className='text-3xl font-bold lg:text-6xl'>Welcome to my Blog</h1>
    //   <p className='text-gray-500 text-xs sm:text-sm'>
    //     Here you'll find a variety of articles and tutorials on topics such as
    //     web development, software engineering, and programming languages.
    //   </p>
    //   <Link */}
    {/* //     to='/search'
    //     className='text-xs sm:text-sm text-teal-500 font-bold hover:underline'
    //   >
    //     View all posts
    //   </Link>
    // </div> */}

      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7'>
       
        {posts && posts.length > 0 && (
          <div className='flex flex-col gap-6'>
            <h2 className='text-2xl font-semibold text-center'>Recent Posts</h2>
            <div className='flex flex-wrap gap-4'>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link
              to={'/search'}
              className='text-lg text-teal-500 hover:underline text-center'
            >
              View all posts
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
