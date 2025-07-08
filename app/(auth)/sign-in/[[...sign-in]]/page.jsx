import { SignIn } from '@clerk/nextjs'
import React from 'react'

const Page = () => {
  return (
    <div >
      <SignIn afterSignInUrl="https://expensifyx.site/dashboard" />

      
    </div>
  )
}

export default Page