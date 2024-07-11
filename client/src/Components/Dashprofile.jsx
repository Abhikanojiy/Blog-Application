import { Alert, Button ,TextInput,Modal} from 'flowbite-react';
import React, { useState,useEffect } from 'react'
import { useRef } from 'react';
import { useSelector } from 'react-redux'

import {app } from '../firebase'
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
 } from 'firebase/storage'
 import {Link } from 'react-router-dom'

 import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateFailure,updateStart,updateSuccess,deleteUserFailure,deleteUserStart,deleteUserSuccess ,signOutSuccess} from '../Redux/user/userslice';
import { useDispatch } from 'react-redux';
import {HiOutlineExclamationCircle} from 'react-icons/hi'


const Dashprofile = () => {
  const [image,setimage]=useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const filepickerref=useRef()
  const [ImageFileUploadProgress,setImageFileUploadProgress]=useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateusersuccess,setupdateusersuccess]=useState(null);
  const [updateusererror,setupdateusererror]=useState(null);
  const [showModal,setShowModal]=useState(false);

  const [formData,setFormData]=useState('');
  const dispatch=useDispatch();
console.log(ImageFileUploadProgress,imageFileUploadError)
    const {currentUser,loading}=useSelector ((state)=>state.user);
    const handleChange=(e)=>{
        setFormData({...formData,[e.target.id]:e.target.value});
    }

    const handlesignout=async ()=>{
try{
  const res=await fetch('api/user/signout',{
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

    const submithandler=async (e)=>{
      e.preventDefault();
      setupdateusererror(null);
      setupdateusersuccess(null);
      if(Object.keys(formData).length===0){
        setupdateusererror('no changes made')
        return ;
      }
      if (imageFileUploading) {
        setupdateusererror('Please wait for image to upload');
        return;
      }
      try{
        dispatch(updateStart());
        const response= await fetch(`/api/user/update/${currentUser._id}`,{
          method:'PUT',
          headers:{
            "Content-Type":'application/json'
          },
          body:JSON.stringify(formData)
        })
        const data=await response.json();

        if(!response.ok){
          setupdateusererror(data.message);
          dispatch(updateFailure(data.message));
          

        }else{
          setupdateusersuccess('user image updated successfully')
         dispatch(updateSuccess(data))
         
        }


      }catch(error){
        dispatch(updateFailure(error.message));
        setupdateusererror(error.message)
      }
     
    }

    const handleDeleteUser= async ()=>{
      setShowModal(false);
      try {
        dispatch(deleteUserStart());
        const res = await fetch(`/api/user/delete/${currentUser._id}`, {
          method: 'DELETE',
        });
        const data = await res.json();
        if (!res.ok) {
          dispatch(deleteUserFailure(data.message));
        } else {
          dispatch(deleteUserSuccess(data));
        }
      } catch (error) {
        dispatch(deleteUserFailure(error.message));
      }
    }

    const changeimagehandler=(e)=>{
      const file=e.target.files[0];
      if(file){
        setimage(file);
        setImageFileUrl(URL.createObjectURL(file));

      }
    }
    useEffect(() => {
      if (image) {
        uploadImage();
      }
    }, [image]);
    
    const uploadImage = async () => {
      setImageFileUploading(true);
      setImageFileUploadError(null);
      try {
        const storage = getStorage(app);
        const fileName = `${new Date().getTime()}_${image.name}`;
        const storageref = ref(storage, fileName);
        const uploadtask = uploadBytesResumable(storageref, image);
    
        uploadtask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setImageFileUploadProgress(progress.toFixed(0));
          },
          (error) => {
            setImageFileUploadError('Could not upload image (File must be less than 2MB)');
            setImageFileUploadProgress(null);
            setImage(null);
            setImageFileUrl(null);
            setImageFileUploading(false);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadtask.snapshot.ref);
            setImageFileUrl(downloadURL);
            setFormData((prevData) => ({ ...prevData, photo: downloadURL }));
            setImageFileUploading(false);
          }
        );
      } catch (error) {
        setImageFileUploadError('An unexpected error occurred during the upload.');
        setImageFileUploadProgress(null);
        setImageFileUploading(false);
      }
    };
    


  return (
    <div className='max-w-lg mx-auto p-3 w-full'>

      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
        <form className= 'flex  flex-col gap-4' onSubmit={submithandler}>
          <input type='file' accept='image/*' onChange={changeimagehandler}  ref={filepickerref} hidden/>
            <div className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full ' onClick={()=>filepickerref.current.click()}>
            {ImageFileUploadProgress && (
            <CircularProgressbar
              value={ImageFileUploadProgress || 0}
              text={`${ImageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    ImageFileUploadProgress / 100
                  })`,
                },
              }}
            />
          )}
                <img src={imageFileUrl||currentUser.photo} className='rounded-full w-full h-full border-8 object-cover border-[lightgray]'/>

            </div>
            {imageFileUploadError&&<Alert color='failure' >{imageFileUploadError}</Alert>}
            <TextInput
          type='text'
          id='username'
          placeholder='username'
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          type='email'
          id='email'
          placeholder='email'
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          type='password'
          id='password'
          placeholder='password'
          onChange={handleChange}
        />
        <Button
          type='submit'
          gradientDuoTone='purpleToBlue'
          outline
          disabled={loading || imageFileUploading}
        > Update</Button>
        {
          currentUser.isAdmin&&(
            <Link to='/create-post'>
               <Button type='button' gradientDuoTone='greenToBlue' className='w-full' outline>Create Post</Button>
            </Link>
           
          )
        }
        </form>
        <div className='flex justify-between text-red-500 mt-5'>
          <span className='cursor-pointer' onClick={()=>setShowModal(true)}>Delete Account</span>
          <span className='cursor-pointer' onClick={handlesignout}>Sign Out</span>
        </div>
        {updateusersuccess && (
        <Alert color='success' className='mt-5'>
          {updateusersuccess}
        </Alert>
      )}
      {updateusererror && (
        <Alert color='failure' className='mt-5'>
          {updateusererror}
        </Alert>
      )}
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
              Are you sure you want to delete your account?
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

export default Dashprofile

