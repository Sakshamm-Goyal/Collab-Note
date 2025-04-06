'use client';

import * as Clerk from '@clerk/elements/common';
import * as SignIn from '@clerk/elements/sign-in';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-4xl font-extrabold text-white">
            Collab Note
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Sign in to access AI-powered collaborative editing
          </p>
        </div>
        <div className="mt-8 bg-gray-900 p-8 rounded-lg shadow-lg">
          <SignIn.Root>
            <SignIn.Step name="start">
              <div className="space-y-6">
                <Clerk.Connection
                  name="google"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                >
                  Sign in with Google
                </Clerk.Connection>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-900 text-gray-400">
                      Or continue with
                    </span>
                  </div>
                </div>

                <Clerk.Field name="identifier">
                  <Clerk.Label className="block text-sm font-medium text-gray-300">
                    Email
                  </Clerk.Label>
                  <Clerk.Input className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                  <Clerk.FieldError className="mt-2 text-sm text-red-500" />
                </Clerk.Field>

                <SignIn.Action
                  submit
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                >
                  Continue
                </SignIn.Action>
              </div>
            </SignIn.Step>

            <SignIn.Step name="verifications">
              <SignIn.Strategy name="email_code">
                <h1 className="text-center text-2xl font-bold text-white mb-4">
                  Check your email
                </h1>
                <p className="text-center text-sm text-gray-400 mb-6">
                  We sent a code to{' '}
                  <span className="font-medium text-blue-400">
                    <SignIn.SafeIdentifier />
                  </span>
                  .
                </p>

                <div className="space-y-6">
                  <Clerk.Field name="code">
                    <Clerk.Label className="block text-sm font-medium text-gray-300">
                      Email code
                    </Clerk.Label>
                    <Clerk.Input className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                    <Clerk.FieldError className="mt-2 text-sm text-red-500" />
                  </Clerk.Field>

                  <SignIn.Action
                    submit
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                  >
                    Continue
                  </SignIn.Action>
                </div>
              </SignIn.Strategy>

              {/* Other strategies follow the same pattern */}
            </SignIn.Step>

            {/* Repeat similar styling updates for other steps */}
          </SignIn.Root>
        </div>
      </div>
    </div>
  );
}
