"use client"

import Link from 'next/link'
import React, { useEffect, useRef } from 'react'
import { Button } from './ui/button'
import Image from 'next/image'

const HeroSection = () => {

    const imageRef = useRef()
    const ticking = useRef(false); 



    useEffect(() => {
        const imageElement = imageRef.current;

        const handleScroll = () => {
            if (!ticking.current) {
                window.requestAnimationFrame(() => {
                    const scrollPosition = window.scrollY;
                    const threshold = 100;

                    if (scrollPosition > threshold) {
                        imageElement?.classList.add('scrolled');
                    } else {
                        imageElement?.classList.remove('scrolled');
                    }

                    ticking.current = false;
                });

                ticking.current = true;
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="pb-20 px-4" >
            <div className="container mx-auto text-center ">
                <h1 className="text-5xl md:text-8xl lg:text-[105px] gradient-text">
                    Manage Your Finances <br /> with ExpensfiyX
                </h1>
                <p className=" text-sm md:text-xl text-gray-500 mb-8 pt-4 max-w-2xl mx-auto ">
                    An Ai-powered financial management platfrom that helps you track,
                    analyze, and optimize your spending with real-time insights.
                </p>
                <div className="flex justify-center space-x-4 ">
                    <Link href={"/dashboard"} >
                        <Button size={"lg"} className="px-8" >
                            Get started
                        </Button>
                    </Link>
                    <Link href={"/"} >
                        <Button size={"lg"} variant={'outline'} className="px-8" >
                            Home Page
                        </Button>
                    </Link>
                </div>
                <div className="hero-image-wrapper">
                    <div
                        className="hero-image"
                        ref={imageRef}
                    >
                        <Image
                            src={"/bannerf.png"}
                            alt="banner"
                            width={1280}
                            height={720}
                            className="mx-auto rounded-lg shadow-2xl border "
                        />
                    </div>
                </div>
            </div>

        </div>
    )
}

export default HeroSection