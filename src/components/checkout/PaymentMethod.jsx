"use client";

export default function PaymentMethod({ selectedMethod, onMethodChange }) {
  const paymentMethods = [
    {
      id: "qr_code",
      name: "Thanh toán qua VNPAY",
      description: "Thanh toán bằng VNPAY",
      icon: "💳",
    },
    {
      id: "cod",
      name: "Thanh toán khi nhận hàng",
      description: "Thanh toán bằng tiền mặt",
      icon: "💰",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Phương thức thanh toán
      </h2>

      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <label
            key={method.id}
            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedMethod === method.id
                ? "border-pink-500 bg-pink-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method.id}
              checked={selectedMethod === method.id}
              onChange={(e) => onMethodChange(e.target.value)}
              className="w-4 h-4 text-pink-600 border-gray-300 focus:ring-pink-500"
            />
            <div className="ml-3 flex-1">
              <div className="flex items-center">
                <span className="text-2xl mr-3">{method.icon}</span>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {method.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {method.description}
                  </div>
                </div>
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
