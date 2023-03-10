import type { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi } from 'openai'

// Configuring OpenAIApi
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

type Error = {
  error: {
    message: string
  }
}

type Data = {
  result: string | undefined
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data | Error>) {
  const request = req.body.input

  if (request === '') {
    res.status(400).json({
      error: {
        message: 'Empty input, please try again',
      },
    })
  }

  try {
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: 'what is 2 * 4',
      temperature: 0.6,
    })
    res.status(200).json({ result: completion.data.choices[0].text })
  } catch (e: any) {}

  res.status(200).json({
    result: request,
  })
}
