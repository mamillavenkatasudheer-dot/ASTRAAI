import { useState } from 'react'
import './App.css'

function App() {
  // Stores the text currently typed by the user
  const [message, setMessage] = useState('')

  // Stores all messages in the conversation
  const [messages, setMessages] = useState([])

  // Stores whether we are waiting for the backend
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    // Don't send an empty message
    if (message.trim() === '') {
      return
    }

    // Save the user's message before clearing the input
    const userText = message

    // Display the user's message
    const userMessage = {
      text: userText,
      sender: 'user',
    }

    setMessages((previousMessages) => [
      ...previousMessages,
      userMessage,
    ])

    // Clear the input box
    setMessage('')

    // Show loading state
    setLoading(true)

    try {
      // Send the user's question to our backend
      const response = await fetch(
        'http://localhost:5000/api/chat',
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

      // Convert the backend response into JavaScript data
      const data = await response.json()

      // Create the AI message
      const aiMessage = {
        text: data.reply,
        sender: 'ai',
      }

      // Display the AI response
      setMessages((previousMessages) => [
        ...previousMessages,
        aiMessage,
      ])
    } catch (error) {
      console.error('Error:', error)

      // Display an error message
      const errorMessage = {
        text: 'Sorry, I could not connect to the backend.',
        sender: 'ai',
      }

      setMessages((previousMessages) => [
        ...previousMessages,
        errorMessage,
      ])
    }

    // Stop loading
    setLoading(false)
  }

  return (
    <div className="app">

      {/* Header */}
      <header className="header">
        <h1>🤖 AstraAI</h1>
        <p>Your AI Assistant</p>
      </header>

      {/* Chat area */}
      <main className="chat-container">

        {/* Welcome message */}
        <div className="welcome">
          <h2>Hello! 👋</h2>
          <p>
            I'm AstraAI. Ask me anything and I'll try to help you.
          </p>
        </div>

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

      {/* Input area */}
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
