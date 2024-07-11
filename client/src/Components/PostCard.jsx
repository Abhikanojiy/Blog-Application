import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'flowbite-react'
import Scrolltotop from './Scrolltotop'
import { useNavigate } from 'react-router-dom'

const PostCard = ({post}) => {
    const navigate=useNavigate();
    const truncateContent = (content, maxLength) => {
       let c= content.replace(/<\/?[^>]+(>|$)/g, "");
        if (c.length > maxLength) {
           return c.substring(0, maxLength) + '...';
        }
        return c;
      };
  return (
    <div className='group relative w-full border border-teal-500 hover:border-2 h-[400px] overflow-hidden rounded-lg sm:w-[350px] transition-all'>
    <Link to={`/post/${post.slug}`}>
      <img
        src={post.image}
        alt='post cover'
        className='h-[200px] w-full  object-cover '
      />
    </Link>
    <div className='p-3 flex flex-col gap-5'>
      <p className='text-lg font-semibold line-clamp-2'>{post.title}</p>
      
      <p className=' italic text-sm'> {truncateContent(post.Content,120)}</p>
     
        <Button onClick={()=>{navigate(`/post/${post.slug}`
        )}} className=' w-full '>Read article</Button>
      
    </div>
  </div>
  )
}

export default PostCard
