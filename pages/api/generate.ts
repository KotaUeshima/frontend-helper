import type { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi } from 'openai'

// Configuring OpenAIApi
// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// })

// const openai = new OpenAIApi(configuration)

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
    const chatResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: `${request}` }],
      }),
    })

    const chatData = await chatResponse.json()

    res.status(200).json({ result: chatData.choices[0].message.content })

    // Original way of sending completion request to openapi

    // const completion = await openai.createCompletion({
    //   model: 'text-davinci-003',
    //   prompt: 'what is 2 * 4',
    //   temperature: 0.6,
    // })

    // res.status(200).json({ result: completion.data.choices[0].text })
  } catch (e: any) {
    res.status(500).json({
      error: {
        message: e.message,
      },
    })
  }
}
