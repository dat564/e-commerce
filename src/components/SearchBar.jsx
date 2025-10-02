"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { SearchOutlined, LoadingOutlined } from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState(null);

  const searchRef = useRef(null);
  const resultsRef = useRef(null);
  const router = useRouter();

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim().length >= 2) {
        performSearch(searchTerm);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        resultsRef.current &&
        !resultsRef.current.contains(event.target)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const performSearch = async (query) => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({
        search: query,
        limit: "5", // Limit to 5 results for dropdown
        status: "active",
      });

      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();

      if (data.success) {
        setSearchResults(data.data.products);
        setShowResults(true);
      } else {
        setError(data.message || "Không thể tìm kiếm sản phẩm");
        setSearchResults([]);
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi tìm kiếm");
      setSearchResults([]);
      console.error("Search error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setShowResults(false);
    }
  };

  const handleResultClick = (productId) => {
    router.push(`/products/${productId}`);
    setShowResults(false);
    setSearchTerm("");
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const highlightSearchTerm = (text, searchTerm) => {
    if (!searchTerm.trim()) return text;

    const regex = new RegExp(`(${searchTerm})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (regex.test(part)) {
        return (
          <span key={index} className="bg-yellow-200 font-medium">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="relative w-full max-w-md">
      <form onSubmit={handleSearchSubmit} className="relative">
        <input
          ref={searchRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm kiếm sản phẩm..."
          className="duration-200 w-full py-2 px-4 pr-10 border border-gray-300 rounded-full focus:ring-1 focus:ring-pink-500 focus:border-pink-500 outline-none"
          autoComplete="off"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-pink-600 transition-colors"
        >
          {isLoading ? (
            <LoadingOutlined className="animate-spin" />
          ) : (
            <SearchOutlined />
          )}
        </button>
      </form>

      {/* Search Results Dropdown */}
      {showResults && (
        <div
          ref={resultsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto"
        >
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <LoadingOutlined className="animate-spin mr-2" />
              Đang tìm kiếm...
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">{error}</div>
          ) : searchResults.length > 0 ? (
            <div className="py-2">
              {searchResults.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleResultClick(product.id)}
                  className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  {/* Product Image */}
                  <div className="w-12 h-12 mr-3 flex-shrink-0">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No Image</span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-600 mb-1">
                      {product.category?.name && (
                        <span className="bg-yellow-200 text-yellow-800 px-1 py-0.5 rounded text-xs mr-2">
                          {product.category.name}
                        </span>
                      )}
                    </div>
                    <h3
                      className="text-sm font-medium text-gray-900 mb-1 overflow-hidden"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {highlightSearchTerm(product.name, searchTerm)}
                    </h3>
                    <p className="text-sm font-semibold text-pink-600">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </div>
              ))}

              {/* View All Results Link */}
              {searchResults.length >= 5 && (
                <div className="p-3 border-t border-gray-200">
                  <button
                    onClick={() => handleSearchSubmit(new Event("submit"))}
                    className="w-full text-center text-sm text-pink-600 hover:text-pink-700 font-medium"
                  >
                    Xem tất cả kết quả cho "{searchTerm}"
                  </button>
                </div>
              )}
            </div>
          ) : searchTerm.trim().length >= 2 ? (
            <div className="p-4 text-center text-gray-500">
              Không tìm thấy sản phẩm nào
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
