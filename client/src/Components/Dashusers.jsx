import { Button, Modal, Table, } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import {HiCheck, HiOutlineExclamationCircle} from 'react-icons/hi'
import { FaCheck } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";



const Dashusers =  ()=> {
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
            const res=await fetch(`https://blog-application-one-snowy.vercel.app/api/user/delete/${PostIdToDelete}`,{
                method:'DELETE'
            });
            const data=await res.json();
            if (res.ok) {
              setuserpost((prev) => prev.filter((user) => user._id !== PostIdToDelete));
              setShowModal(false);
          } else {
              console.log(data.message);
          }
        }catch(error){
            console.log(error.message)
        }
    }
  
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`https://blog-application-one-snowy.vercel.app/api/user/gettingusers?userId=${currentUser._id}`);
                const data = await res.json();
                console.log(data.posts);
                if (res.ok) {
                    setuserpost(data.users);
                    if(data.posts.length<9){
                        setshowmore(false);
                    }
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        
console.log(currentUser.isAdmin)
      if(currentUser.isAdmin)  {
        fetchUser();
      } // Call the fetchPosts function
    }, [currentUser._id]); // Dependency array
  
  
  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
        {currentUser.isAdmin && userpost.length>0?(
            <>
            <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>User Image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              {/* <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell> */}
            </Table.Head>
            {
                userpost.map((user)=>(
                    <Table.Body className='divide-y'>
                       
                            <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                            <Table.Cell>     {new Date(user.updatedAt).toLocaleDateString()}</Table.Cell>
                            <Table.Cell>
                             <Link to={`post/${user.slug}`}> 
                             <img src={user.photo}
                             alt={user.title}
                              className='w-10 h-10
                            

                              object-cover bg-gray-500 rounded-full'
                             />
                              </Link>
                            </Table.Cell>
                            <Table.Cell>
                                <Link to={`post/${user.slug}`} className='font-medium text-gray-900 dark:text-white'>
                                {user.username}
                                </Link>
                            </Table.Cell>
                            <Table.Cell>
                            {user.isAdmin ? <>{<FaCheck/>}</>:<>{<RxCross2/>}</>
                            }
                            </Table.Cell>
                            <Table.Cell>
                                <span className='text-red-500 hover:underline ' onClick={()=>{
                                    setShowModal(true);
                                    setPostIdToDelete(user._id);

                                }}>Delete</span>
                           
                            </Table.Cell>
                            {/* <Table.Cell>
                            <Link
                      className='text-teal-500 hover:underline'
                      to={`/updatepo/${post._id}`}
                    >
                      <span>Edit</span>
                    </Link>
                            </Table.Cell> */}

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

export default Dashusers
