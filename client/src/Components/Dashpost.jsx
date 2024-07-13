import { Button, Modal, Table, } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import {HiOutlineExclamationCircle} from 'react-icons/hi'

const Dashpost =  ()=> {
    const {currentUser}=useSelector((state)=>state.user);
    const [userpost,setuserpost]=useState([]);
    const [showmore,setshowmore]=useState(false);
    const [showModal,setShowModal]=useState(false);
    const [PostIdToDelete,setPostIdToDelete]=useState('');


    const handleshowmore=()=>{
        
    }

    const handleDeleteUser=async ()=>{
        setShowModal(true);
        try{
            const res=await fetch(`https://blog-application-one-snowy.vercel.app/api/post/delete/${PostIdToDelete}/${currentUser._id}`,{
                method:'DELETE'
            });
            const data=await res.json();
            if (!res.ok) {
                console.log(data.message);
              } else {
                   if (!res.ok) {
        console.log(data.message);
      } else {
        setuserpost((prev) =>
          prev.filter((post) => post._id !== PostIdToDelete)
        );
      }((prev) =>
                  prev.filter((post) => post._id !== PostIdToDelete)
                );
              }
        }catch(error){
            console.log(error.message)
        }
    }
  
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch(`https://blog-application-one-snowy.vercel.app/api/post/getpost`);
                const data = await res.json();
                console.log(data.posts);
                if (res.ok) {
                    setuserpost(data.posts);
                    if(data.posts.length<9){
                        setshowmore(false);
                    }
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        
console.log(currentUser.isAdmin)
      
        fetchPosts();
      // Call the fetchPosts function
    }, [currentUser._id]); // Dependency array
  
    console.log(userpost)
  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
        {/* {currentUser.isAdmin &&  */}
        {userpost.length>0?(
            <>
            <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {
                userpost.map((post)=>(
                    <Table.Body className='divide-y'>
                       
                            <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                            <Table.Cell>     {new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                            <Table.Cell>
                             <Link to={`post/${post.slug}`}> 
                             <img src={post.image}
                             alt={post.title}
                              className='w-20 h-10 object-cover bg-gray-500'
                             />
                              </Link>
                            </Table.Cell>
                            <Table.Cell>
                                <Link to={`/post/${post.slug}`} className='font-medium text-gray-900 dark:text-white'>
                                {post.title}
                                </Link>
                            </Table.Cell>
                            <Table.Cell>
                            {post.category}
                            </Table.Cell>
                            <Table.Cell>
                                <span className='text-red-500 hover:underline ' onClick={()=>{
                                    setShowModal(true);
                                    setPostIdToDelete(post._id);

                                }}>Delete</span>
                           
                            </Table.Cell>
                            <Table.Cell>
                            <Link
                      className='text-teal-500 hover:underline'
                      to={`/updatepo/${post._id}`}
                    >
                      <span>Edit</span>
                    </Link>
                            </Table.Cell>

                            </Table.Row>
                        
                    </Table.Body>
                ))
            }
        </Table>
        {
            showmore && (
                <Button onClick={handleshowmore}
                 className='w-full text-teal-500 self-center text-sm py-7'
                >Show more</Button>
            )
        }
        </>
    
    ):(<p>you have no posts</p>)}

     <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete this post ?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
        
    </div>
  )
}

export default Dashpost
