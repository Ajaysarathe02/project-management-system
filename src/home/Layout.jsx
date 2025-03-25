import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import Header from './Header'

function Layout() {
  return (
    <div>
      
      <div className='bg-black'>
        <Outlet />
      </div>
    </div>
  )
}

export default Layout