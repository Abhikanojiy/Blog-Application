import React, { useState } from 'react'
import {Avatar, Button, DarkThemeToggle, Dropdown, DropdownDivider, Navbar,Modal, TextInput} from "flowbite-react"
import { Link, Navigate } from 'react-router-dom'
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSearch } from "react-icons/fa";
import { IoMoon } from "react-icons/io5";
import {useSelector} from 'react-redux'
import { toggleTheme } from '../Redux/theme/themeslice';
import { useDispatch } from 'react-redux';
import { signOutSuccess } from '../Redux/user/userslice';
import { HiBookOpen, HiOutlineExclamationCircle, HiPencilAlt } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const { currentUser } = useSelector((state) => state.user);
    const[showModal,setshowModal]=useState(false);
    const navigate=useNavigate();
const dispatch=useDispatch();

const handlesignout=async ()=>{
    try{
      const res=await fetch('https://blog-application-one-snowy.vercel.app/api/user/signout',{
        method:'POST',
        
      })
    const data=await res.json();
    if(res.ok){
      dispatch(signOutSuccess());
    }
    }catch(error){
    console.log(error.message)
    }
        }

  return (
    <div>
  <Navbar className='border-b-2'>
    <Link to='/' className="self-center whitespace-nowrap text-sm
    sm:text-xl font-semibold dark:text-white">
    <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% rounded-lg text-white'>
        Avi's
    </span>
    Blog
    </Link>
    <form >
        <TextInput  
        
        type='text'
        placeholder='search...'
        rightIcon={FaSearch}
        className="hidden lg:inline"
        />
        
    </form>
    <Button className='lg:hidden w-12 h-10 flex ' color='gray'>
        <FaSearch/>
    </Button>
    <div className='flex justify-center items-center gap-3 md:order-2'>
        <Button onClick={()=>dispatch(toggleTheme())} className='w-12 h-10 hidden sm:flex rounded-md' color='gray'  pill>
            <FaMoon />
        </Button>
   {
     currentUser? (
        <Dropdown  arrowIcon={false} label={<Avatar alt='user' img={currentUser.photo} rounded/>} inline>
           <Dropdown.Header>
           <span className='block text-sm'>@{currentUser.username}</span> 
           <span className='block text-sm font-medium truncate'>{currentUser.email}</span> 
           </Dropdown.Header>
           <Link to={'/dashboard?tab=profile'}>
            
           
           <Dropdown.Item>profile</Dropdown.Item>
           <DropdownDivider/>
        
            </Link>
           
            <Dropdown.Item onClick={handlesignout}>Sign Out</Dropdown.Item>
          
        </Dropdown>
    ):( <Link to='/signin'>
    <Button  gradientDuoTone='purpleToBlue'  outline>
        Signin
    </Button>
</Link>)
   }
   
   
  <Navbar.Toggle/>
    </div>
    <Navbar.Collapse>
        <Navbar.Link as={'div'}>
            <Link to='/'>
                Home
            </Link>
        </Navbar.Link>
        <Navbar.Link as={'div'}>
            <Link to='/About'>
                About
            </Link>
        </Navbar.Link>
        <Navbar.Link as={'div'}>
            {
                currentUser?<>
                 <Link to='/create-post' className='flex item-center'>
            <HiPencilAlt className='mr-2 mt-1' /> Write a Blog
            </Link></>:<>
           <div className='flex items-center'>
           <HiPencilAlt className='mr-2' /><span onClick={()=>setshowModal(true)}>Write a Blog</span>
           </div>
           
            </>
            }
           
        </Navbar.Link>
        
        </Navbar.Collapse>
   
  </Navbar>

<Modal
show={showModal}
onClose={() => setshowModal(false)}
popup
size='md'
>
<Modal.Header />
<Modal.Body>
  <div className='text-center'>
    <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
    <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
      you need to Signup first
    </h3>
    <div className='flex justify-center'>
        
        <Button onClick={()=>{
            navigate('/signup')
            setshowModal(false)
        }}>
            Signup
        </Button>
    
       
    </div>
   
  </div>
</Modal.Body>
</Modal>
</div>
  )

  
}



export default Header
