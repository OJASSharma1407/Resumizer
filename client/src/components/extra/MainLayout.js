import React from 'react'
import Navbar from '../main/Navbar'
import { Outlet } from 'react-router-dom'


export default function MainLayout() {
  return (
    <>
        <Navbar/>
        <div>
            <Outlet/>
        </div>
    </>
  )
}
