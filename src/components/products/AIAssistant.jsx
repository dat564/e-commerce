"use client";

import { useState } from "react";

export default function AIAssistant({ product }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content: `Xin chào! Tôi là M.O.B AI ASSISTANT. Tôi chuyên tư vấn về nến thơm và body mist. Hãy hỏi tôi về ${product.name} - từ hương thơm cách sử dụng đồn...`,
    },
  ]);

  const suggestedQuestions = [
    "Sản phẩm này có những ưu điểm gì?",
    "Giá cả như thế nào?",
    "Có phù hợp làm quà tặng không?",
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      type: "user",
      content: message,
    };

    setMessages([...messages, newMessage]);
    setMessage("");

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        type: "bot",
        content:
          "Cảm ơn bạn đã hỏi! Tôi sẽ trả lời câu hỏi của bạn về sản phẩm này. Đây là một sản phẩm chất lượng cao với hương thơm tuyệt vời.",
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const handleSuggestedQuestion = (question) => {
    setMessage(question);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-40"
      >
        <div className="w-8 h-8 flex items-center justify-center">
          <span className="text-2xl">🎁</span>
        </div>
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 flex items-end justify-end z-50 p-4"
          style={{
            background:
              "linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)",
            backdropFilter: "blur(2px)",
          }}
        >
          <div className="bg-white rounded-t-2xl w-full max-w-md h-[600px] flex flex-col shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-xl">🎁</span>
                  </div>
                  <div>
                    <h3 className="font-bold">M.O.B AI ASSISTANT</h3>
                    <p className="text-xs text-white/80">Trực tuyến</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.type === "user"
                        ? "bg-pink-500 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Suggested Questions */}
            <div className="px-4 pb-2">
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedQuestion(question)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Hỏi về sản phẩm này..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none text-sm"
                />
                <button
                  type="submit"
                  className="bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
