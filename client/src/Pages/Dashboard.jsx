import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Dashsidebar from '../Components/Dashsidebar';
import Dashprofile from '../Components/Dashprofile';
import Dashpost from '../Components/Dashpost';
import Dashusers from '../Components/Dashusers';


const Dashboard = () => {
  const [tab,settab]=useState('');
  const location=useLocation();
  useEffect(()=>{
    const urlparams=new URLSearchParams(location.search);
    const taburl=urlparams.get('tab');
  settab(taburl);
  },[location.search]);
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-56'>
        <Dashsidebar/>

      </div>
    
      {(tab==='profile') && <Dashprofile/>}
      {(tab==='post') && <Dashpost/>}
      {(tab==='users')&&<Dashusers/>}
      
    
    </div>
  )
}

export default Dashboard
