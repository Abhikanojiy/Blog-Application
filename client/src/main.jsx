import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {store,  persistor } from './Redux/store.js'


import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import Themeprovider from './Components/Themeprovider.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
<PersistGate persistor={persistor}>
<Provider store={store}>
    <Themeprovider>
    <App />
    </Themeprovider>
    
 
    </Provider>
</PersistGate>
   


  
)
