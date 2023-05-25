"use client";

import client from "@/libs/appwrite";
import { Account, ID } from "appwrite";
import React, { FormEventHandler, useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import { AiOutlineLoading3Quarters as Spinner } from "react-icons/ai";
import Link from "next/link";

const SignUpPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    try {
      setIsLoading(true);
      const accountClient = new Account(client);
      const session = await accountClient.createEmailSession(email, password);

      router.push("/app");
    } catch (error: any) {
      if (Object.hasOwn(error, "message")) {
        toast.error(error.message);
      } else {
        toast.error("Unknown error");
      }
    }
    setIsLoading(false);
  };
  return (
    <div>
      <section className="bg-gray-50">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <a
            href="#"
            className="flex items-center mb-6 text-2xl font-semibold text-gray-900"
          >
            {/* <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo"> */}
            Resu-Me
          </a>
          <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 ">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
                Sign in to your account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Your email
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 focus:ring-1 text-gray-900 sm:text-sm rounded-lg focus:outline-none focus:ring-secondary-main focus:border-secondary-main block w-full p-2.5"
                    placeholder="name@company.com"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Password
                  </label>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 focus:ring-1 text-gray-900 sm:text-sm rounded-lg focus:outline-none focus:ring-secondary-main focus:border-secondary-main block w-full p-2.5"
                    required
                  />
                </div>
                {/* <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="remember"
                        aria-describedby="remember"
                        type="checkbox"
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:outline-none focus:ring-secondary-light"
                        required
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="remember" className="text-gray-500">
                        Remember me
                      </label>
                    </div>
                  </div>
                  <a
                    href="#"
                    className="text-sm font-medium text-secondary-main hover:underline"
                  >
                    Forgot password?
                  </a>
                </div> */}
                <button
                  type="submit"
                  className="relative w-full text-white bg-secondary-main hover:bg-secondary-dark focus:ring-4 focus:outline-none focus:ring-secondary-light font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  <span>Sign in</span>
                  {isLoading && (
                    <div className="absolute inset-y-0 right-0 flex items-center justify-center pr-4">
                      <Spinner className="animate-spin" />
                    </div>
                  )}
                </button>
                <p className="text-sm font-light text-gray-500">
                  Don’t have an account yet?{" "}
                  <Link
                    href="/auth/signup"
                    className="font-medium text-secondary-main hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
      <ToastContainer />
    </div>
  );
};

export default SignUpPage;
