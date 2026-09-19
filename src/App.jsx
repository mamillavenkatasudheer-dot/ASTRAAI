import { useState } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    // Don't send empty messages
    if (message.trim() === '' || loading) {
      return
    }

    const userText = message.trim()

    // Add user's message
    setMessages((previousMessages) => [
      ...previousMessages,
      {
        text: userText,
        sender: 'user',
      },
    ])

    // Clear input box
    setMessage('')

    // Start loading
    setLoading(true)

    try {
      // Connect to the PUBLIC AstraAI backend on Render
      const response = await fetch(
        'https://astraai-tzac.onrender.com/api/chat',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            message: userText,
          }),
        }
      )

      // Check if server returned an error
      if (!response.ok) {
        let errorMessage = `Server error: ${response.status}`

        try {
          const errorData = await response.json()

          if (errorData.reply) {
            errorMessage = errorData.reply
          }
        } catch {
          // Keep the default error message
        }

        throw new Error(errorMessage)
      }

      // Convert server response to JSON
      const data = await response.json()

      // Add AstraAI response
      setMessages((previousMessages) => [
        ...previousMessages,
        {
          text:
            data.reply ||
            'Sorry, I could not generate a response.',
          sender: 'ai',
        },
      ])
    } catch (error) {
      console.error('Connection Error:', error)

      // Show error in the chat
      setMessages((previousMessages) => [
        ...previousMessages,
        {
          text:
            error.message ||
            'Sorry, I could not connect to AstraAI. Please try again.',
          sender: 'ai',
        },
      ])
    } finally {
      // Stop loading
      setLoading(false)
    }
  }

  return (
    <div className="app">

      {/* Header */}
      <header className="header">
        <h1>🤖 AstraAI</h1>
        <p>Your AI Assistant</p>
      </header>

      {/* Chat Area */}
      <main className="chat-container">

        {/* Welcome message */}
        {messages.length === 0 && (
          <div className="welcome">
            <h2>Hello! 👋</h2>

            <p>
              I'm AstraAI. Ask me anything and I'll try to
              help you.
            </p>
          </div>
        )}

        {/* Messages */}
        <div className="messages">

          {messages.map((msg, index) => (
            <div
              className={
                msg.sender === 'user'
                  ? 'user-message'
                  : 'ai-message'
              }
              key={index}
            >
              {msg.text}
            </div>
          ))}

          {/* Loading message */}
          {loading && (
            <div className="ai-message">
              AstraAI is thinking... 🤔
            </div>
          )}

        </div>
      </main>

      {/* Input Area */}
      <div className="input-container">

        <input
          type="text"
          placeholder="Ask me anything..."
          value={message}
          onChange={(event) => {
            setMessage(event.target.value)
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleSend()
            }
          }}
          disabled={loading}
        />

        <button
          onClick={handleSend}
          disabled={loading}
        >
          {loading ? 'Thinking...' : 'Send'}
        </button>

      </div>

    </div>
  )
}

export default App