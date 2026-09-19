require('dotenv').config()

const express = require('express')
const cors = require('cors')
const Groq = require('groq-sdk')

const app = express()
const PORT = process.env.PORT || 5000

// Create Groq AI client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

// Middleware
app.use(cors())
app.use(express.json())

// Test backend
app.get('/', (req, res) => {
  res.json({
    message: 'AstraAI backend is running! 🤖',
  })
})

// Chat API
app.post('/api/chat', async (req, res) => {
  try {
    const userMessage = req.body.message

    console.log('User asked:', userMessage)

    // Check for empty message
    if (!userMessage || userMessage.trim() === '') {
      return res.status(400).json({
        reply: 'Please enter a question.',
      })
    }

    // Send request to Groq
    const completion = await groq.chat.completions.create({
      model: 'openai/gpt-oss-20b',

      messages: [
        {
          role: 'system',
          content: `
You are AstraAI, a friendly educational AI assistant.

Your job is to explain answers clearly and accurately, especially for students.

IMPORTANT RESPONSE RULES:

1. Always start with a simple definition or direct answer.

2. Explain the topic step by step.

3. Use clear headings.

4. Use numbered lists for steps.

5. Use bullet points for lists.

6. Keep paragraphs short.

7. Do NOT give one huge paragraph.

8. Explain technical words in simple language.

9. For electronics questions, use this structure when appropriate:

   Definition
   Components / Parts
   Working Principle
   Step-by-Step Working
   Types
   Applications
   Advantages
   Disadvantages

10. For programming questions, use:

   What it does
   Logic
   Code
   Explanation
   Output

11. For mathematics, show every calculation step.

12. For comparison questions, use a table when useful.

13. Give a simple real-world example when useful.

14. Do not unnecessarily repeat information.

15. Keep the answer appropriate for a beginner engineering student.

16. Use Markdown formatting.

17. End every educational answer with:

### In one line

Give a very short summary of the answer.

IMPORTANT:
Do not write everything as a single paragraph.
Make the answer neat, structured, and easy to study.
          `,
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
    })

    const answer =
      completion.choices[0]?.message?.content ||
      'Sorry, I could not generate a response.'

    console.log('AstraAI replied successfully.')

    res.json({
      reply: answer,
    })

  } catch (error) {
    console.error('Groq Error:')
    console.error(error)

    // Handle rate limit
    if (error.status === 429) {
      return res.status(429).json({
        reply:
          'AstraAI is temporarily busy because the AI request limit has been reached. Please try again later.',
      })
    }

    // Handle other errors
    res.status(500).json({
      reply:
        'Sorry, AstraAI could not generate a response.',
    })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(
    `AstraAI server is running on port ${PORT}`
  )
})