import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { LoginPage, MainPage, MapPage, NotFoundPage, UserPage } from './pages'


function Router() {
  return (
    <BrowserRouter >
      <Routes basename='/'>
        <Route path='/' element={<MainPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/map' element={<MapPage />} />
        <Route path='/user' element={<UserPage />} />
        <Route path='/*' element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router