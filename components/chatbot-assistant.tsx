"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageCircle, Send, X, Minimize2, Maximize2 } from "lucide-react"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
}

export function ChatbotAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content:
        "👋 Hi! I'm your Konnekt My City assistant. How can I help you today? I can help you report issues, find existing reports, or answer questions about the platform.",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    // Simple intent matching
    if (lowerMessage.includes("report") || lowerMessage.includes("issue")) {
      return "Great! I can help you report an issue. To get started, tell me:\n1. What type of issue? (pothole, water leak, power outage, etc.)\n2. Where is it located?\n3. Do you have a photo?\n\nOr, you can click 'Report Issue' in the navigation menu to go directly to the reporting page."
    } else if (lowerMessage.includes("map") || lowerMessage.includes("find")) {
      return "You can view all reported issues on our interactive map! Click 'Browse Issues' in the navigation to see a map of all issues in your area with real-time updates."
    } else if (lowerMessage.includes("vote") || lowerMessage.includes("upvote")) {
      return "You can support issues you care about by upvoting them! When you see an issue that affects you, click the upvote button. More votes help prioritize issues for municipal attention."
    } else if (lowerMessage.includes("track") || lowerMessage.includes("status")) {
      return "You can track your reported issues in your Dashboard. Go to 'Dashboard' to see all your reports, their current status, and any updates from municipal officials."
    } else if (lowerMessage.includes("municipal") || lowerMessage.includes("official")) {
      return "Municipal officials have access to a dedicated dashboard where they can:\n- View all reported issues\n- Update issue status\n- Post official responses\n- View analytics and trends\n\nOfficial sign-in is available through the 'Sign In' option."
    } else if (lowerMessage.includes("account") || lowerMessage.includes("sign")) {
      return "To create an account:\n1. Click 'Sign Up' in the navigation\n2. Enter your email and password\n3. Select your municipality\n4. Verify your email\n5. You're ready to go!\n\nAlready have an account? Click 'Sign In' to log in."
    } else if (lowerMessage.includes("thanks") || lowerMessage.includes("thanks") || lowerMessage.includes("ok")) {
      return "You're welcome! 😊 If you need more help, just ask. Type 'help' to see common questions."
    } else if (lowerMessage.includes("help")) {
      return "Here are some things I can help with:\n• How to report an issue\n• Finding issues on the map\n• How voting/upvoting works\n• Tracking your issues\n• Municipal official features\n• Account and sign-up\n\nJust ask me anything!"
    } else {
      return "I can help with questions about reporting issues, finding reports, voting, tracking status, and more. What would you like to know?"
    }
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsLoading(true)

    // Simulate bot thinking delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: generateBotResponse(input),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botResponse])
      setIsLoading(false)
    }, 500)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed z-50 w-14 h-14 bg-gradient-to-br from-blue-600 to-green-600 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center text-white"
        style={{ 
          bottom: "calc(1.5rem + 64px)",
          right: "1.5rem"
        }}
        title="Open chat assistant"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    )
  }

  return (
    <>
      {/* Overlay - Only on mobile when chat is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/0 md:bg-black/0 z-40 md:z-0"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Chatbot Card */}
      <Card 
        className={`fixed z-50 shadow-2xl transition-all w-full sm:w-96 max-h-screen sm:max-h-[600px] ${
          isMinimized ? "h-14" : "h-[500px] sm:h-[600px]"
        }`}
        style={{
          bottom: isOpen ? 0 : "auto",
          left: 0,
          right: 0,
          margin: "0 auto",
          borderBottomLeftRadius: isOpen ? 0 : "0.625rem",
          borderBottomRightRadius: isOpen ? 0 : "0.625rem",
        }}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b bg-gradient-to-r from-blue-50 to-green-50">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <MessageCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div className="min-w-0">
              <CardTitle className="text-base sm:text-lg truncate">Konnekt Assistant</CardTitle>
              <CardDescription className="text-xs truncate">Always here to help</CardDescription>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-white/50 rounded transition-colors"
              title={isMinimized ? "Maximize" : "Minimize"}
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button 
              onClick={() => setIsOpen(false)} 
              className="p-1 hover:bg-white/50 rounded transition-colors" 
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            <CardContent className="flex-1 overflow-y-auto p-3 sm:p-4 h-[380px] sm:h-[480px] space-y-3 sm:space-y-4 bg-white">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base ${
                      message.type === "user"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-gray-100 text-gray-900 rounded-bl-none"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{message.content}</p>
                    <span className={`text-xs ${message.type === "user" ? "text-blue-100" : "text-gray-500"} block mt-1`}>
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 px-3 sm:px-4 py-2 rounded-lg rounded-bl-none">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </CardContent>

            <div className="border-t p-3 sm:p-4 space-y-3 bg-white">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask me anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  disabled={isLoading}
                  className="text-xs sm:text-sm h-9 sm:h-10"
                />
                <Button onClick={handleSendMessage} disabled={isLoading} size="sm" className="bg-blue-600 hover:bg-blue-700 px-2 sm:px-3">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setInput("How do I report an issue?")}
                  className="text-xs bg-gray-100 hover:bg-gray-200 p-2 rounded transition-colors text-gray-700"
                >
                  Report Issue
                </button>
                <button
                  onClick={() => setInput("How do I find issues?")}
                  className="text-xs bg-gray-100 hover:bg-gray-200 p-2 rounded transition-colors text-gray-700"
                >
                  Find Issues
                </button>
              </div>
            </div>
          </>
        )}
      </Card>
    </>
  )
}
