
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { LayoutDashboard, PenBox } from 'lucide-react'
import { checkUser } from '@/lib/checkUser'

const Header = async () => {

    await checkUser()

    return (
        <div className="fixed top-0 w-full bg-white/40 backdrop-blur-md z-50 border-b ">
            <nav className='w-full py-3 flex items-center justify-between  px-5 md:px-20'>
                <Link href="/">
                    <Image
                        src="/logof.png"
                        alt="logo"
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="h-10 md:h-12 w-auto object-contain"
                    />
                </Link>

                <div className='flex items-center space-x-4'>

                    <SignedIn>
                        <Link href={"/dashboard"} className='text-gray-900 hover:text-blue-600 flex items-center gap-2'>
                            <Button variant='outline' className={"cursor-pointer"}>
                                <LayoutDashboard size={18} />
                                <span className='hidden  md:inline '>Dashboard</span>
                            </Button>
                        </Link>
                        <Link href={"/transaction/create"}>
                            <Button className='flex cursor-pointer items-center gap-2' >
                                <PenBox size={18} />
                                <span className='hidden md:inline  '>Add Transaction</span>
                            </Button>
                        </Link>
                    </SignedIn>

                    <SignedOut>
                        <SignInButton forceRedirectUrl={"/dashboard"}>
                            <Button
                                className="px-8 transition-colors cursor-pointer  duration-300 ease-in-out rounded-sm bg-white text-black hover:bg-black hover:text-white"
                                variant='outline'
                            >
                                Login
                            </Button>
                        </SignInButton>
                    </SignedOut>

                    <SignedIn>
                        <UserButton
                            appearance={{
                                elements: {
                                    avatarBox: "clerk-avatar-big ",
                                },
                            }}
                        />
                    </SignedIn>
                </div>

            </nav>
        </div>
    )
}

export default Header