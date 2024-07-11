import React, { useState } from 'react'



import { Button, Sidebar } from "flowbite-react";
import {HiUser,HiArrowSmRight,HiLibrary, HiUsers} from 'react-icons/hi'
import {useSelector} from 'react-redux'
import {useNavigate,Link} from 'react-router-dom'

const Dashsidebar = () => {

  const {currentUser}=useSelector((state)=>state.user);
  

  return (
    
      <Sidebar className='w-full md:w-56'>
        <Sidebar.Items>
            <Sidebar.ItemGroup>
            <Sidebar.Item icon={HiUser} 
            
              label ={currentUser.isAdmin?'Admin':'User'
            } 
       as='div'
            >
             Profile 
            </Sidebar.Item>
            {currentUser.isAdmin &&<Sidebar.Item icon={HiLibrary}  
          
       
            >
            <Link to='/dashboard?tab=post'> Posts</Link>  
            </Sidebar.Item>}
            {currentUser.isAdmin &&<Sidebar.Item icon={HiUsers}  
          
       
          >
          <Link to='/dashboard?tab=users'> Users</Link>  
          </Sidebar.Item>}
            <Sidebar.Item icon={HiArrowSmRight} >
               Sign Out
            </Sidebar.Item>


          
          
            </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    
  )
}

export default Dashsidebar
