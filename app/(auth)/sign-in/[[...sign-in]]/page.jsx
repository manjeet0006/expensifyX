import { SignIn } from '@clerk/nextjs'
import React from 'react'

const Page = () => {
  return (
    <div >
      <SignIn
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
        redirectUrl="/dashboard"
      />

    </div>
  )
}

export default Page