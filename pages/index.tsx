import Head from 'next/head'
import { Inter } from 'next/font/google'
import { useRef, useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [result, setResult] = useState<string | null>(null)

  const handleSearch = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    const input = inputRef.current?.value

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input }),
      })

      const data = await response.json()

      // if invalid request, throw error object in data or new error
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`)
      }

      const { result } = data

      setResult(result)

      // clear search bar after success
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    } catch (e: any) {
      // console error and alert error
      console.error(e.message)
      alert(e.message)
    }
  }

  return (
    <>
      <Head>
        <title>Frontend Helper</title>
        <meta name='description' content='App to help frontend developers using OpenAI' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className='min-h-screen w-screen bg-primary flex flex-col'>
        <div className='h-[30vh] w-screen flex justify-center items-center'>
          <form onSubmit={handleSearch} className='bg-white p-10 rounded-md drop-shadow-lg'>
            <input
              ref={inputRef}
              className='text-3xl text-secondary placeholder:text-gray-500 bg-transparent outline-none'
              type='text'
              placeholder='Try Frontend Helper...'
            />
          </form>
        </div>
        <div className='h-[70vh] w-screen flex justify-center items-center'>
          <div className='bg-white p-10 max-w-3xl rounded-md drop-shadow-lg'>{result && <p className='text-base font-bold'>{result}</p>}</div>
        </div>
      </main>
    </>
  )
}
