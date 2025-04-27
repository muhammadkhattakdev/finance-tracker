import { useState } from 'react'
import './App.css'
import Router from './components/router'
import ToastContainer from './components/dashoardComponents/toastNotification/container'

function App() {

  return (
    <>
      <Router />
      <ToastContainer />
    </>
  )
}

export default App
