'use client';

import * as Clerk from '@clerk/elements/common';
import * as SignUp from '@clerk/elements/sign-up';
import { FaGoogle } from 'react-icons/fa';
export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-4xl font-extrabold text-white">
            Collab Note
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Create an account to access AI-powered collaborative editing
          </p>
        </div>
        <div className="mt-8 bg-gray-900 p-8 rounded-lg shadow-lg">
          <SignUp.Root 
          
          // routing='path'
          >
            <SignUp.Step name="start">
              <h1 className="text-2xl font-bold text-white mb-6">
                Create an account
              </h1>
              <div className="space-y-6">
                <Clerk.Connection

                  name="google"
                  className="w-full flex gap-1 items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                >
                  <FaGoogle />
                  Sign up with Google
                </Clerk.Connection>

                <Clerk.Field name="username">
                  <Clerk.Label className="block text-sm font-medium text-gray-300">
                    Username
                  </Clerk.Label>
                  <Clerk.Input className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                  <Clerk.FieldError className="mt-2 text-sm text-red-500" />
                </Clerk.Field>

                <Clerk.Field name="emailAddress">
                  <Clerk.Label className="block text-sm font-medium text-gray-300">
                    Email
                  </Clerk.Label>
                  <Clerk.Input className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                  <Clerk.FieldError className="mt-2 text-sm text-red-500" />
                </Clerk.Field>

                <Clerk.Field name="password">
                  <Clerk.Label className="block text-sm font-medium text-gray-300">
                    Password
                  </Clerk.Label>
                  <Clerk.Input className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                  <Clerk.FieldError className="mt-2 text-sm text-red-500" />
                </Clerk.Field>

                <SignUp.Action
                  submit
                  
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                >
                  Sign up
                </SignUp.Action>
              </div>
            </SignUp.Step>

            {/* Other steps follow the same styling pattern */}
          </SignUp.Root>
        </div>
      </div>
    </div>
  );
}
