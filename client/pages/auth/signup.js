
import { useRouter } from "next/router"
import { ArrowRightOnRectangleIcon } from '@heroicons/react/20/solid'
import { useState } from "react";
import VideoRecorder from 'react-video-recorder'
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from 'react-toastify';
import cryptoRandomString from 'crypto-random-string';
import { ApiRegister } from "../../services/api";
import { ThreeDots } from 'react-loader-spinner'

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
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!register.first_video) {
            toast.error("You must record a video", {
                position: toast.POSITION.TOP_RIGHT
            });
            return;
        }
        const formData = new FormData();
        const keys = Object.keys(register);
        const videoName = cryptoRandomString({ length: 64, type: 'alphanumeric' }) + ".webm";
        for (let value in keys) {
            let index = keys[value];
            if (index === "first_video") {
                formData.append("first_video", register.first_video, videoName);
            } else formData.append(index, register[index]);
        }
        formData.append("videoPath", videoName);
        onRegister(formData);
    }

    const onRegister = async (payload) => {
        try {
            setLoading(true);
            const res = await ApiRegister(payload);
            if (res.status === 201) {
                router.push("/auth/signin");
            }
            setLoading(false);
        } catch (error) {
            const errorMessage = error?.response?.data?.error || "Something went wrong";
            toast.error(errorMessage, {
                position: toast.POSITION.TOP_RIGHT
            })
            setLoading(false);
        }
    }

    const onComplete = (videoBlob) => {
        console.log("videoBlob", videoBlob)
        setRegister({ ...register, first_video: videoBlob })
    }

    return (<>
        <ToastContainer />
        <ThreeDots
            height="80"
            width="80"
            radius="9"
            color="rgb(22 163 74)"
            ariaLabel="three-dots-loading"
            wrapperStyle={
                { position: "absolute", top: "50%", left: "50%", zIndex: 100 }
            }
            wrapperClassName=""
            visible={loading}
        />
        <main className="flex bg-gray-50 dark:bg-gray-900">
            <div className="flex  w-full flex-col items-center justify-center px-4 py-4 mx-auto">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700">
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