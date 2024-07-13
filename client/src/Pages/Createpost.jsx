import { TextInput,Select,FileInput, Button,Alert } from 'flowbite-react'
import React, { useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {app} from'../firebase'
import {useNavigate} from 'react-router-dom'

const Createpost = () => {
  const[file,setFile]=useState(null);
  const [ImageUploadProgress,setImageUploadProgress]=useState(null);
  const [ImageUploaderror,setImageUploaderror]=useState(null);
  const [formData,setFormData]=useState({});
  const [publisherror,setpublisherror]=useState(null);
  const navigate=useNavigate();
  console.log(formData)
  
  
  const handlesubmithandler=async (e)=>{
    e.preventDefault();
      try{
        const res=await fetch('https://blog-application-one-snowy.vercel.app/api/post/create',{
          method:'POST',
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify(formData)
        
        }
      )
      const data=await res.json()
      if(!res.ok){
        setpublisherror(data.message);
      }
      if(res.ok){
        navigate(`/post/${data.slug}`)
      }
      }catch(error){
console.log(error)
      }
  }


  const handleuploadimage=async ()=>{
    try{
      if(!file){
        setImageUploaderror("please select an image")
        return;
      }
      setImageUploaderror(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploaderror('Image upload failed');
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploaderror(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
      
    }catch(error){
setImageUploadProgress(null);
setImageUploaderror(null);
    }
  }

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
        <h1 className='text-center text-3xl my-7 font-semibold'>Create-Post</h1>
        <form className='flex flex-col gap-4'>
            <div className='flex flex-col gap-4 sm:flex-row justify-between'>
                <TextInput  
                 type='text'
                 placeholder='Title'
                 required
                 id='title'
                 className='flex-1'
                 onChange={(e)=>
                  setFormData({...formData , title: e.target.value})
                }
                /> 
                    <Select 
                    onChange={(e)=>setFormData({...formData,category:e.target.value})}>
                    <option value='uncategorized'>Select a category</option>
            <option value='javascript'>JavaScript</option>
            <option value='reactjs'>React.js</option>
            <option value='nextjs'>Next.js</option>
                    </Select>
                    
               
            </div>

            <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
          <FileInput
            type='file'
            accept='image/*'
            onChange={(e) => setFile(e.target.files[0])}
            
          />
          <Button
            type='submit'
            gradientDuoTone='purpleToBlue'
            size='sm'
            onClick={handleuploadimage}
            disabled={ImageUploadProgress}
            outline
           
          >
              {ImageUploadProgress ? (
              <div className='w-16 h-16'>
                <CircularProgressbar
                  value={ImageUploadProgress}
                  text={`${ImageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              'Upload Image'
            )}
          </Button>

        </div>
        {ImageUploaderror && (<Alert color='failure'>{ImageUploaderror}</Alert>)}
        {formData.image && (
          <img
            src={formData.image}
            alt='upload'
            className='w-full h-72 object-cover'
          />
        )}
        <ReactQuill theme='snow' placeholder='write something'
        className='h-72 mb-12'
        onChange={(value)=>{
          setFormData({...formData,Content:value})
        }}
        />
        <Button type='submit' gradientDuoTone='purpleToBlue' onClick={handlesubmithandler}>Publish</Button>
        {publisherror&&<Alert  color="failure">{publisherror}</Alert>}
        </form>
        
      
    </div>
  )
}

export default Createpost
