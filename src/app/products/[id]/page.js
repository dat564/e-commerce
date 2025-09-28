import { notFound } from "next/navigation";
import ProductImageGallery from "@/components/products/ProductImageGallery";
import ProductInfo from "@/components/products/ProductInfo";
import ProductTabs from "@/components/products/ProductTabs";
import RelatedProducts from "@/components/products/RelatedProducts";
import AIAssistant from "@/components/products/AIAssistant";
import PageTransition from "@/components/PageTransition";

// Mock data - in real app, this would come from API/database
const products = {
  1: {
    id: 1,
    name: "Nến Thơm Bath & Body Works White Tea & Sage 3-Wick Candle",
    price: 499000,
    originalPrice: 599000,
    images: [
      "/assets/images/products/white-tea-sage-1.jpg",
      "/assets/images/products/white-tea-sage-2.jpg",
      "/assets/images/products/white-tea-sage-3.jpg",
    ],
    category: "Nến Thơm",
    categorySlug: "nen-thom",
    stock: 100,
    inStock: true,
    description:
      "Nến Thơm Bath & Body Works White Tea & Sage 3-Wick Candle 441g (1)",
    features: [
      "Màu Năng",
      "Trà trắng",
      "Cây xô thơm",
      "Cam bergamot",
      "Thời gian đốt 40 tiếng",
    ],
    specifications: {
      weight: "441g",
      burnTime: "40 tiếng",
      wicks: "3 bấc",
      fragrance: "White Tea & Sage",
    },
    returnPolicy:
      "Đổi trả nếu không đúng hình ảnh hoặc không đáp ứng yêu cầu trong vòng 72 giờ kể từ khi nhận hàng",
  },
  2: {
    id: 2,
    name: "Nến thơm thư giãn Bath & Body Works Aromatherapy",
    price: 499000,
    originalPrice: 599000,
    images: [
      "/assets/images/products/stress-relief-1.jpg",
      "/assets/images/products/stress-relief-2.jpg",
    ],
    category: "Nến Thơm",
    categorySlug: "nen-thom",
    stock: 50,
    inStock: true,
    description: "Nến thơm giúp thư giãn và giảm stress",
    features: [
      "Màu Năng",
      "Tình dầu bạc hà",
      "Xạ hương",
      "Thời gian đốt 45 tiếng",
    ],
    specifications: {
      weight: "411g",
      burnTime: "45 tiếng",
      wicks: "3 bấc",
      fragrance: "Stress Relief",
    },
    returnPolicy:
      "Đổi trả nếu không đúng hình ảnh hoặc không đáp ứng yêu cầu trong vòng 72 giờ kể từ khi nhận hàng",
  },
};

const relatedProducts = [
  {
    id: 2,
    name: "Nến thơm thư giãn Bath & Body Works Aromatherapy",
    price: 499000,
    image: "/assets/images/products/stress-relief.jpg",
    description: "Nến thơm giúp thư giãn và giảm stress",
    features: [
      "Màu Năng",
      "Tình dầu bạc hà",
      "Xạ hương",
      "Thời gian đốt 45 tiếng",
    ],
    category: "Nến Thơm",
  },
  {
    id: 3,
    name: "Nến Thơm Bath & Body Works Peppermint Bark 3-Wick",
    price: 499000,
    image: "/assets/images/products/peppermint-bark.jpg",
    description: "Nến thơm với hương bạc hà và socola",
    features: ["Màu Năng", "Socola trắng tan chảy", "Thời gian đốt 45 tiếng"],
    category: "Nến Thơm",
  },
  {
    id: 4,
    name: "Nến thơm Bath & Body Works WHITE GARDENIA 3 bấc",
    price: 499000,
    image: "/assets/images/products/white-gardenia.jpg",
    description: "Nến thơm với hương hoa dành dành",
    features: [
      "Màu Năng",
      "Nước táo ngọt",
      "Cây dành dành",
      "Hoa huệ trắng",
      "Thời gian đốt 40 tiếng",
    ],
    category: "Nến Thơm",
  },
  {
    id: 5,
    name: "Nến thơm Bath & Body Works FALL APPLE CIDER",
    price: 499000,
    image: "/assets/images/products/fall-apple-cider.jpg",
    description: "Nến thơm với hương táo mùa thu",
    features: ["Màu Năng", "Táo là giảm", "Thời gian đốt 40 tiếng"],
    category: "Nến Thơm",
  },
];

export async function generateStaticParams() {
  return Object.keys(products).map((id) => ({
    id: id,
  }));
}

export async function generateMetadata({ params }) {
  const product = products[params.id];

  if (!product) {
    return {
      title: "Sản phẩm không tồn tại - M.O.B",
    };
  }

  return {
    title: `${product.name} - M.O.B`,
    description: product.description,
  };
}

export default function ProductDetailPage({ params }) {
  const product = products[params.id];

  if (!product) {
    notFound();
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="bg-gray-100 py-3">
          <div className="container mx-auto px-4 max-w-6xl">
            <nav className="text-sm text-gray-600">
              <span className="hover:text-pink-600 cursor-pointer">Home</span>
              <span className="mx-2">/</span>
              <span className="hover:text-pink-600 cursor-pointer">
                Sản phẩm của M.O.B
              </span>
              <span className="mx-2">/</span>
              <span className="hover:text-pink-600 cursor-pointer">
                {product.category}
              </span>
              <span className="mx-2">/</span>
              <span className="text-gray-800 line-clamp-1">{product.name}</span>
            </nav>
          </div>
        </div>

        {/* Main Product Content */}
        <div className="py-8">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Product Images */}
              <ProductImageGallery product={product} />

              {/* Product Info */}
              <ProductInfo product={product} />
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <ProductTabs product={product} />

        {/* Related Products */}
        <RelatedProducts products={relatedProducts} />

        {/* AI Assistant */}
        <AIAssistant product={product} />
      </div>
    </PageTransition>
  );
}
