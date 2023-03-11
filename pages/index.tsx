import Head from 'next/head'
import { Inter } from 'next/font/google'
import { useRef, useState } from 'react'
import { CopyBlock, dracula } from 'react-code-blocks'
import { CodeBracketSquareIcon, BackwardIcon } from '@heroicons/react/24/solid'
import toast, { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [result, setResult] = useState<string>('')
  const [showCode, setShowCode] = useState<boolean>(false)

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

      // hydration error?
      // toast.success(`Succesful render of ${input}`, {
      //   duration: 1500,
      // })

      setResult(result)

      // clear search bar after success
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    } catch (e: any) {
      // toast the error!
      toast.error(e.message, {
        duration: 1500,
      })
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
        {/* Neccesary for react-hot-toast */}
        <Toaster />
        <div className='h-[30vh] w-screen flex justify-center items-center'>
          <form onSubmit={handleSearch} className='w-[50vw] bg-white p-10 rounded-md drop-shadow-lg'>
            <input
              ref={inputRef}
              className='w-full text-2xl text-secondary placeholder:text-gray-500 bg-transparent outline-none'
              type='text'
              placeholder='Try Frontend Helper...'
            />
          </form>
        </div>
        <div className='h-[70vh] w-screen flex justify-center items-center'>
          <div className='overflow-y-auto relative flex justify-center items-center h-[60vh] w-[50vw] bg-white p-10 max-w-3xl rounded-md drop-shadow-lg'>
            {!showCode && (
              <>
                <CodeBracketSquareIcon
                  onClick={() => setShowCode(!showCode)}
                  className='absolute top-4 right-4 h-10 w-10 text-gray-200 hover:text-gray-700 ease-in-out duration-300'
                />
                <div dangerouslySetInnerHTML={{ __html: result }} />
              </>
            )}
            {showCode && (
              <>
                <BackwardIcon
                  onClick={() => setShowCode(!showCode)}
                  className='absolute top-4 right-4 h-10 w-10 text-gray-200 hover:text-gray-700 ease-in-out duration-300'
                />
                <CopyBlock text={result} language='javascript' showLineNumbers={false} theme={dracula} />
              </>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
