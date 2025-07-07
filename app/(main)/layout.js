import React from 'react'


const MainLayout = ({ children }) => {
  return (
    <div className=' px-5 md:px-20  my-24 ' >
        {children}
    </div>
  )
}

export default MainLayout