import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="overflow-y-auto">
      <header className="p-4">
        <nav className="flex justify-between items-center">
          <div>
            <Image src="/logo.svg" alt="app logo" width={100} height={32} />
          </div>
          <ul className="flex gap-4">
            <li>
              <Link href="/auth/signin" className="hover:underline">
                Login
              </Link>
            </li>
            <li>
              <Link href="/auth/signup" className="primary-btn">
                Register
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <div className="overflow-y-auto">
        <section className="container mx-auto p-4 flex items-center gap-8 flex-wrap md:flex-nowrap min-h-[500px]">
          <div className="flex flex-col gap-2 mt-8 md:mt-0 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-extrabold">
              A Personalized, One-Stop{" "}
              <span className="inline main-gradient">Resume Organizer</span>
            </h1>
            <p className="text-xl">
              Manage, organize, and search for your perfect resume for any job
              application.
            </p>
            <div>
              <button className="primary-btn font-xl px-8 py-2">
                Get Started
              </button>
            </div>
          </div>
          <div className="md:max-w-[50%]">
            <Image
              width={1439}
              height={902}
              alt="App preview"
              src="/app-screenshot.png"
              className="shadow"
            />
          </div>
        </section>
        <section className="">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              className="fill-secondary-light"
              fill-opacity="1"
              d="M0,224L40,229.3C80,235,160,245,240,250.7C320,256,400,256,480,234.7C560,213,640,171,720,154.7C800,139,880,149,960,170.7C1040,192,1120,224,1200,213.3C1280,203,1360,149,1400,122.7L1440,96L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
            ></path>
          </svg>
          <div className="bg-secondary-light text-white">
            <div className="container mx-auto p-4">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
                Features
              </h2>
              <div>
                <div className="flex flex-col md:flex-row gap-8 md:gap-4">
                  <div className="w-full md:w-1/2">
                    <h3 className="font-semibold text-2xl mb-2">
                      Upload. Download. Save your resumes in the cloud.
                    </h3>
                    <p className="text-lg font-light">
                      Upload your resume files and assign relevant attributes to
                      them. Add a title and a description, assign resumes to
                      groups, and tag them with different skills, industries,
                      and roles.
                    </p>
                  </div>
                  <div className="w-full md:w-1/2">
                    <Image
                      src="/upload-resume.PNG"
                      width={1400}
                      height={100}
                      alt="upload resume"
                      className="w-full shadow"
                    />
                  </div>
                </div>

                <hr className="my-16" />

                <div className="flex flex-col md:flex-row gap-8 md:gap-4">
                  <div className="w-full md:w-1/2 order-1">
                    <Image
                      src="/make-custom-values.PNG"
                      width={1400}
                      height={100}
                      alt="custom values"
                      className="w-full shadow"
                    />
                  </div>
                  <div className="w-full md:w-1/2 md:order-2">
                    <h3 className="font-semibold text-2xl mb-2">
                      Create and Assign Custom Values
                    </h3>
                    <p className="text-lg font-light">
                      Create your own custom values for skills, industries, and
                      job roles that best fit your resumes
                    </p>
                  </div>
                </div>
                <hr className="my-16" />

                <div className="flex flex-col md:flex-row gap-8 md:gap-4">
                  <div className="w-full md:w-1/2">
                    <h3 className="font-semibold text-2xl mb-2">
                      Filter Through Relevant Attributes
                    </h3>
                    <p className="text-lg font-light">
                      Easily search through your resumes by filtering them by
                      all available attributes.
                    </p>
                  </div>
                  <div className="w-full md:w-1/2">
                    <Image
                      src="/filter-values.PNG"
                      width={1400}
                      height={100}
                      alt="upload resume"
                      className="w-full shadow"
                    />
                  </div>
                </div>

                <hr className="my-16" />

                <div className="flex flex-col md:flex-row gap-8 md:gap-4">
                  <div className="w-full md:w-1/2 order-1">
                    <Image
                      src="/group-management.PNG"
                      width={1400}
                      height={100}
                      alt="custom values"
                      className="w-full shadow"
                    />
                  </div>
                  <div className="w-full md:w-1/2 md:order-2">
                    <h3 className="font-semibold text-2xl mb-2">
                      Manage Resume Groups
                    </h3>
                    <p className="text-lg font-light">
                      Create groups and subgroups. Assign resumes to any group
                      to further organize and manage them. Mark resumes as
                      favorites.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              className="fill-secondary-light"
              fill-opacity="1"
              d="M0,192L120,181.3C240,171,480,149,720,154.7C960,160,1200,192,1320,208L1440,224L1440,0L1320,0C1200,0,960,0,720,0C480,0,240,0,120,0L0,0Z"
            ></path>
          </svg>
        </section>

        <section className="container mx-auto p-4 text-center mb-32">
          <div className="">
            <h2 className="text-3xl md:text-4xl font-bold">Made With</h2>
            <div className="mt-8 flex flex-col items-center gap-8">
              <Image
                src="appwrite.svg"
                alt="appwrite logo"
                width={450}
                height={30}
              />
              <div className="text-xl">
                <p className="text-black mb-4">
                  This project was made with{" "}
                  <a
                    className="text-[#f02e65] hover:underline"
                    href="https://appwrite.io/"
                    target="_blank"
                  >
                    Appwrite
                  </a>{" "}
                  as a submission of this{" "}
                  <a
                    href="https://hashnode.com/hackathons/appwrite?source=main-feed"
                    target="_blank"
                    className="text-secondary-main hover:underline"
                  >
                    hackathon hosted on Hashnode
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* <footer className="bg-secondary-dark">
          <div className="p-4">swagg</div>
        </footer> */}
      </div>
    </div>
  );
}
