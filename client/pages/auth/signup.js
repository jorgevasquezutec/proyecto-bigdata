
import { useRouter } from "next/router"
import { ArrowRightOnRectangleIcon } from '@heroicons/react/20/solid'
import { useState } from "react";
import VideoRecorder from 'react-video-recorder'

export default function SingUp() {
    const router = useRouter();
    const [register, setRegister] = useState(
        {
            firstName: "",
            lastName: "",
            userName: "",
            email: "",
            password: "",
            first_video: null,
        }
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("entro")
        console.log(register)
        // router.push('/auth/signin')
    }
    const onComplete = (videoBlob) => {
        console.log("videoBlob", videoBlob)
        // const urlObject = window.URL.createObjectURL(videoBlob);
        // const link = document.createElement('a');
        // link.href = urlObject;
        // link.setAttribute('download', 'recording2');
        // document.body.appendChild(link);
        // link.click();
        // document.body.removeChild(link);
        setRegister({ ...register, first_video: videoBlob })
    }

    return (<>
        <main className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">

                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Create and account
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>

                            <div className="flex space-x-2">
                                <div >
                                    <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First Name</label>
                                    <input type="text"
                                        name="first_name"
                                        id="first_name"
                                        value={register.firstName}
                                        onChange={(e) => setRegister({ ...register, firstName: e.target.value })}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        required />
                                </div>
                                <div >
                                    <label htmlFor="last_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last Name</label>
                                    <input type="text"
                                        name="last_name"
                                        id="last_name"
                                        value={register.lastName}
                                        onChange={(e) => setRegister({ ...register, lastName: e.target.value })}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        required />
                                </div>

                            </div>

                            <div>
                                <label htmlFor="user_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">User Name</label>
                                <input type="text"
                                    name="user_name"
                                    id="user_name"
                                    value={register.userName}
                                    onChange={(e) => setRegister({ ...register, userName: e.target.value })}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required />
                            </div>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                <input type="email"
                                    name="email"
                                    id="email"
                                    value={register.email}
                                    onChange={(e) => setRegister({ ...register, email: e.target.value })}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="name@company.com"
                                    required />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input type="password"
                                    name="password"
                                    id="password"
                                    placeholder="••••••••"
                                    value={register.password}
                                    onChange={(e) => setRegister({ ...register, password: e.target.value })}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required />
                            </div>

                            <div>
                                <VideoRecorder
                                    isOnInitially={true}
                                    onRecordingComplete={(videoBlob) => onComplete(videoBlob)}
                                    isFlipped={true}
                                    countdownTime={3000}
                                    timeLimit={5000}
                                />
                            </div>

                            <button
                                onClick={() => router.push('/auth/signup')}
                                className="group relative flex w-full justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <ArrowRightOnRectangleIcon className="h-5 w-5 text-green-500 group-hover:text-green-400" aria-hidden="true" />
                                </span>
                                Sign up
                            </button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Already have an account? <a onClick={() => router.push('/auth/signin')} className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign In here</a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </main>

    </>)


}