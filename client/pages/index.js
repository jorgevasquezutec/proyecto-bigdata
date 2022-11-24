import Head from 'next/head'
import { getSession } from 'next-auth/react'
import { signOut } from "next-auth/react"

export default function Home({ osession }) {

  return (
    <div>
      <Head>
        <title>Spoofing</title>
        <meta name="description" content="Spoofing login app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="isolate bg-white">
        <div className="px-6 pt-6 lg:px-8">
          <div>
            <nav className="flex h-9 items-center justify-between" aria-label="Global">

              <div className="lg:flex lg:min-w-0 lg:flex-1 lg:justify-end">
                <a
                  onClick={() => { signOut() }}
                  className="inline-block rounded-lg px-3 py-1.5 text-sm font-semibold leading-6 text-gray-900 shadow-sm ring-1 ring-gray-900/10 hover:ring-gray-900/20"
                >
                  Log Out
                </a>
              </div>
            </nav>

          </div>
        </div>
        <main>
          <div className="relative px-6 lg:px-8">
            <div className="mx-auto max-w-3xl pt-20 pb-32 sm:pt-48 sm:pb-40">
              <div>
                <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                </div>
                <div>
                  <h1 className="text-4xl font-bold tracking-tight sm:text-center sm:text-6xl">
                    Bienvenido {osession?.user.name}
                  </h1>
                  <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-center">
                    Proyecto Big Data
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) return {
    redirect: {
      destination: '/auth/signin',
      permanet: false
    }
  }
  return {
    props: {
      osession: session,
    }
  }
}

