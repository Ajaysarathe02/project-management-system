import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import Header from './Header'

function Layout() {
  return (
    <div>
      
      <div className=''>
        <Outlet />
      </div>
    </div>
  )
}

export default Layout