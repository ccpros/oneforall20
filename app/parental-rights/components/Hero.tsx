import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { SignedIn, SignedOut } from '@clerk/nextjs'

function Hero() {
  return (
    <div className="flex flex-col items-center justify-center h-screen py-2 bg-background" >
    <Image className="rounded-full border-cyan-600/80 border-4" src="/images/icon.jpg" alt="logo" width={200} height={200} />
          
    <div className="bg-background p-6 mt-4 rounded-2xl shadow-md sm:max-w-2xl md:max-w-3xl lg:max-w-6xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-6">
                Protecting Parental Rights
              </h1>
              <p className="text-lg mb-6">
                If you&apos;ve experienced violations of your parental rights in family court, you&apos;re not alone.
                This initiative helps you understand your rights and take the next step toward action.
              </p>
      
              <div className="flex justify-center gap-4 mt-8 flex-wrap">
                <SignedIn>
                <Link href="/parental-rights/submit-claim">
                  <span className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-700 transition">
                    Submit a Claim
                  </span>
                </Link>
                </SignedIn>
                <SignedOut>
                <Link href="/parental-rights/sign-up/">
                  <span className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-700 transition">
                    Submit a Claim
                  </span>
                </Link>
                </SignedOut>
      
                <Link href="/parental-rights/resources">
                  <span className="border border-blue-600 text-blue-600 px-6 py-3 rounded-xl hover:bg-blue-50 transition">
                    Know Your Rights
                  </span>
                </Link>
              </div>
    </div>
      </div>
  )
}

export default Hero