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
    } catch (error: any) {
      // console error and alert error
      console.error(error.message)
      alert(error.message)
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
      <main className='min-h-screen flex flex-col'>
        <form onSubmit={handleSearch} className='flex flex-col justify-center items-center bg-primary p-10'>
          <input
            ref={inputRef}
            className='text-4xl text-white placeholder:text-white bg-transparent outline-none'
            type='text'
            placeholder='Try Frontend Helper...'
          />
        </form>
        <div className='grow w-screen bg-secondary flex justify-center items-center'>{result && <p className='text-base font-bold'>{result}</p>}</div>
      </main>
    </>
  )
}
