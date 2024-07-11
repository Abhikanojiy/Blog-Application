import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import Signup from './Pages/Signup';
import About from './Pages/About';
import Dashboard from './Pages/Dashboard';
import Signin from './Pages/Signin';
import { BrowserRouter } from 'react-router-dom';
import Headers from './Components/Header';
import Footercom from './Components/Footercom';
import Privateroute from './Components/Privateroute';
import Createpost from './Pages/Createpost';
import Onlyadminprivate from './Components/Onlyadminprivate';
import Updatepost from './Pages/Updatepost';
import Dashusers from './Components/Dashusers';
import Postpage from './Pages/Postpage';
import Scrolltotop from './Components/Scrolltotop';


const App = () => {
  return (
    <BrowserRouter>
     <Scrolltotop />
      <Headers />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/signin' element={<Signin />} />
        {/* Private Routes */}
        <Route element={<Privateroute />}>
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>
        {/* Admin Routes */}
        <Route element={<Onlyadminprivate />}>
         
          <Route path='/updatepo/:postId' element={<Updatepost />} />
          

          
        </Route>
        <Route path='/about' element={<About />} />
        <Route path='/create-post' element={<Createpost />} />
       
        <Route path='/post/:postSlug' element={<Postpage/>} />
       
       
      </Routes>
      <Footercom />
    </BrowserRouter>
  );
};

export default App;
