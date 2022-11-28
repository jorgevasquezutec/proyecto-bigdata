
import { LockClosedIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import VideoRecorder from 'react-video-recorder'
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from 'react-toastify';
import { ThreeDots } from  'react-loader-spinner'
import cryptoRandomString from 'crypto-random-string';
import { ApiLogin } from '../../services/api'


const coreLogin = async ({ email, password, any_video }) => {
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      const videoName = cryptoRandomString({ length: 64, type: 'alphanumeric' }) + ".webm";
      formData.append("any_video", any_video, videoName);
      const res = await ApiLogin(formData);
      // console.log(res);
      return {
        ...res.data,
        status: true
      };
  
    } catch (error) {
      const errorMessage = error?.response?.data?.error || "Something went wrong";
      return {
        error: errorMessage,
        status: false,
      }
    }
  }
  

export default function SingIn() {

    const [userInfo, setUserInfo] = useState({ email: "", password: "", any_video: null })
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()
        // console.log(userInfo)
        if (!userInfo.any_video) {
            toast.error("You must record a video", {
                position: toast.POSITION.TOP_RIGHT
            })
            return;
        }

        setLoading(true)
        const data = await coreLogin(userInfo);
        if(!data.status){
            setLoading(false)
            toast.error(data.error, {
                position: toast.POSITION.TOP_RIGHT
            })
            return;
        }
        const res = await signIn('credentials', {
            ...data.user,
            token: data.token,
            // any_video: test,
            redirect: false
        })
        setLoading(false)
        console.log(res);
        if (!res.ok) {
            toast.error(res.error, {
                position: toast.POSITION.TOP_RIGHT
            })
            return;
        }
        //cuando este listo
        router.push('/')
    }

    const onComplete = (videoBlob) => {
        console.log("videoBlob", videoBlob)
        console.log("videoBlob", videoBlob.size)
        setUserInfo({ ...userInfo, any_video: videoBlob })
    }


    return (
        <>
            <ToastContainer />
            <ThreeDots
                height="80"
                width="80"
                radius="9"
                color="rgb(79 70 229)"
                ariaLabel="three-dots-loading"
                wrapperStyle={
                    { position: "absolute", top: "50%", left: "50%" , zIndex: 100}
                }
                wrapperClassName=""
                visible={loading}
            />
            <main className="flex bg-gray-50  dark:bg-gray-900">
                <div className="flex w-full flex-col items-center justify-center px-6 py-8 mx-auto ">
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Sign in to your account
                            </h1>
                            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                    <input type="email"
                                        value={userInfo.email}
                                        onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                                        name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com"
                                        required />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                    <input type="password"
                                        value={userInfo.password}
                                        onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })}
                                        name="password" id="password" placeholder="••••••••"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        required />
                                </div>

                                <div>
                                    <VideoRecorder
                                        isOnInitially={true}
                                        onRecordingComplete={(videoBlob) => onComplete(videoBlob)}
                                        // isFlipped={true}
                                        countdownTime={3000}
                                        timeLimit={5000}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="group relative mb-3 flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
                                    </span>
                                    Sign in
                                </button>
                                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                    Don’t have an account yet? <a onClick={() => router.push('/auth/signup')} className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</a>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}