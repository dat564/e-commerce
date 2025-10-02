"use client";

import { useState } from "react";

export default function AIAssistant({ product }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
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

    // Generate specific response based on question
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        type: "bot",
        content: generateResponse(message, product),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const generateResponse = (question, product) => {
    const lowerQuestion = question.toLowerCase();

    // Price related questions
    if (
      lowerQuestion.includes("giá") ||
      lowerQuestion.includes("price") ||
      lowerQuestion.includes("tiền")
    ) {
      return `Sản phẩm ${
        product.name
      } có giá ${product.price?.toLocaleString()}₫. Đây là mức giá hợp lý cho một sản phẩm chất lượng cao như vậy. Bạn có thể thanh toán bằng nhiều phương thức khác nhau.`;
    }

    // Gift related questions
    if (
      lowerQuestion.includes("quà") ||
      lowerQuestion.includes("gift") ||
      lowerQuestion.includes("tặng")
    ) {
      return `Hoàn toàn phù hợp làm quà tặng! ${product.name} được đóng gói đẹp mắt và có hương thơm sang trọng. Đây là món quà ý nghĩa cho người thân yêu, đặc biệt phù hợp cho các dịp đặc biệt.`;
    }

    // Advantages/benefits questions
    if (
      lowerQuestion.includes("ưu điểm") ||
      lowerQuestion.includes("lợi ích") ||
      lowerQuestion.includes("tốt") ||
      lowerQuestion.includes("benefit")
    ) {
      return `Sản phẩm ${product.name} có nhiều ưu điểm: hương thơm tự nhiên, thành phần an toàn, thiết kế sang trọng và hiệu quả lâu dài. Sản phẩm được nhiều khách hàng tin tưởng và đánh giá cao.`;
    }

    // Usage questions
    if (
      lowerQuestion.includes("cách dùng") ||
      lowerQuestion.includes("sử dụng") ||
      lowerQuestion.includes("usage")
    ) {
      return `Cách sử dụng ${product.name} rất đơn giản: xịt nhẹ lên cổ tay hoặc cổ, sau đó thoa đều. Tránh xịt trực tiếp lên mặt. Sản phẩm có thể sử dụng hàng ngày để tạo hương thơm quyến rũ.`;
    }

    // Ingredients questions
    if (
      lowerQuestion.includes("thành phần") ||
      lowerQuestion.includes("ingredient") ||
      lowerQuestion.includes("nguyên liệu")
    ) {
      return `${product.name} được làm từ các thành phần tự nhiên và an toàn. Sản phẩm không chứa các chất độc hại và phù hợp với mọi loại da. Chúng tôi cam kết về chất lượng và độ an toàn của sản phẩm.`;
    }

    // Default response
    return `Cảm ơn bạn đã hỏi về ${product.name}! Đây là một sản phẩm chất lượng cao với hương thơm tuyệt vời. Bạn có thể hỏi thêm về giá cả, cách sử dụng, hoặc thành phần của sản phẩm.`;
  };

  const handleSuggestedQuestion = (question) => {
    const newMessage = {
      id: messages.length + 1,
      type: "user",
      content: question,
    };

    setMessages([...messages, newMessage]);

    // Generate specific response based on question
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        type: "bot",
        content: generateResponse(question, product),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Button - only show when chat is closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-40"
        >
          <div className="w-8 h-8 flex items-center justify-center">
            <span className="text-2xl">🎁</span>
          </div>
        </button>
      )}

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-full max-w-md h-[600px] flex flex-col shadow-2xl z-50">
          <div className="bg-white rounded-2xl w-full h-full flex flex-col">
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
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="text-white/80 hover:text-white transition-colors"
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
                        d={isMinimized ? "M4 8h16M4 16h16" : "M20 12H4"}
                      />
                    </svg>
                  </button>
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
            </div>

            {/* Chat Content - only show when not minimized */}
            {!isMinimized && (
              <>
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
                      className="duration-200 flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-pink-500 focus:border-pink-500 outline-none text-sm"
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
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
