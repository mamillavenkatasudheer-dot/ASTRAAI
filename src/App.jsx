import { useState } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (message.trim() === '' || loading) {
      return
    }

    const userText = message.trim()

    // Add user's message to the chat
    setMessages((previousMessages) => [
      ...previousMessages,
      {
        text: userText,
        sender: 'user',
      },
    ])

    setMessage('')
    setLoading(true)

    try {
      // Connect to the online AstraAI backend
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

      // Check if the server returned an error
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const data = await response.json()

      // Add AstraAI's response
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

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          text:
            'Sorry, I could not connect to AstraAI. Please try again.',
          sender: 'ai',
        },
      ])
    } finally {
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