import { TextInput,Select,FileInput, Button,Alert } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
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
import {useNavigate,useParams} from 'react-router-dom'
import { useSelector } from 'react-redux';

const Updatepost = () => {
  const[file,setFile]=useState(null);
  const [ImageUploadProgress,setImageUploadProgress]=useState(null);
  const [ImageUploaderror,setImageUploaderror]=useState(null);
  const [formData,setFormData]=useState({});
  const [publisherror,setpublisherror]=useState(null);
  const navigate=useNavigate();
  const {postId}=useParams();
  const {currentUser}=useSelector((state)=>state.user);
  console.log(formData)
  
  useEffect(() => {
    try {
      const fetchPost = async () => {
        const res = await fetch(`/api/post/getpost?postId=${postId}`);
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
          setpublisherror(data.message);
          return;
        }
        if (res.ok) {
            setpublisherror(null);
          setFormData(data.posts[0]);
        }
      };

      fetchPost();
    } catch (error) {
      console.log(error.message);
    }
  }, [postId]);

  const updateposthandler=async(e)=>{
    e.preventDefault();
    try{
      const res=await fetch(`/api/post/update/${formData._id}/${currentUser._id}`,{
        method:'PUT',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(formData)
      })
      const data=await res.json();
      if (!res.ok) {
        setpublisherror(data.message);
        return;
      }

      if (res.ok) {
        setpublisherror(null);
        navigate(`/post/${data.slug}`)}

    }catch(error){
      setpublisherror(error.message)
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
        <h1 className='text-center text-3xl my-7 font-semibold'>Update-Post</h1>
        <form className='flex flex-col gap-4' onSubmit={updateposthandler}>
            <div className='flex flex-col gap-4 sm:flex-row justify-between' >
                <TextInput  
                
                 type='text'
                 placeholder='Title'
                 required
                 id='title'
                 className='flex-1'
                
                 onChange={(e)=>
                  setFormData({...formData , title: e.target.value})
                  
                }
                value={formData.title}
                
                /> 
                    <Select 
                   
                    onChange={(e)=>setFormData({...formData,category:e.target.value} ) }  value={formData.category}>
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
            type='button'
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
        value={formData.Content}
        />
        <Button type='submit' gradientDuoTone='purpleToBlue'>Publish Update</Button>

        </form>
      
    </div>
  )
}

export default Updatepost
