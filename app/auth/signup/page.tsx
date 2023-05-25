"use client";

import client from "@/libs/appwrite";
import { Account, AppwriteException, ID } from "appwrite";
import React, { FormEventHandler, useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import { AiOutlineLoading3Quarters as Spinner } from "react-icons/ai";
import Link from "next/link";

const SignUpPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    try {
      setIsLoading(true);
      if (password !== confirmPassword)
        throw new Error("Password confirmation does not match");
      const accountClient = new Account(client);
      const newAccount = await accountClient.create(
        ID.unique(),
        email,
        password,
        name
      );
      router.push("/");
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
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <a
            href="#"
            className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
          >
            {/* <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo"> */}
            Resu-Me
          </a>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Create an account
              </h1>
              <form
                className="space-y-4 md:space-y-6"
                action="#"
                onSubmit={handleSubmit}
              >
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border focus:ring-1 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:outline-none focus:ring-secondary-light focus:border-secondary-light block w-full p-2.5"
                    placeholder="your@gmail.com"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    name="name"
                    id="name"
                    className="bg-gray-50 border focus:ring-1 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:outline-none focus:ring-secondary-light focus:border-secondary-light block w-full p-2.5"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
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
                    className="bg-gray-50 border focus:ring-1 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:outline-none focus:ring-secondary-light focus:border-secondary-light block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Confirm password
                  </label>
                  <input
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    type="password"
                    name="confirm-password"
                    id="confirm-password"
                    placeholder="••••••••"
                    className="bg-gray-50 border focus:ring-1 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:outline-none focus:ring-secondary-light focus:border-secondary-light block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="relative w-full text-white bg-secondary-main hover:bg-secondary-dark focus:ring-4 focus:outline-none focus:ring-secondary-light font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-secondary-main dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  <span>Create an account</span>
                  {isLoading && (
                    <div className="absolute inset-y-0 right-0 flex items-center justify-center pr-4">
                      <Spinner className="animate-spin" />
                    </div>
                  )}
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link
                    href="/auth/signin"
                    className="font-medium text-secondary-main hover:underline"
                  >
                    Login here
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
