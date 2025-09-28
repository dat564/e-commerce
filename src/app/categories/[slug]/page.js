import { notFound } from "next/navigation";
import ProductGrid from "@/components/products/ProductGrid";
import PageTransition from "@/components/PageTransition";

// Mock data - in real app, this would come from API/database
const categories = {
  "nen-thom": {
    id: 1,
    name: "Nến Thơm",
    slug: "nen-thom",
    description: "Nến thơm cao cấp với hương thơm tự nhiên",
    products: [
      {
        id: 1,
        name: "Nến Thơm Bath & Body Works White Tea & Sage 3-Wick",
        price: 499000,
        image: "/assets/images/products/white-tea-sage.jpg",
        description: "Nến thơm với hương trà trắng và cây xô thơm",
        features: [
          "Màu Năng",
          "Trà trắng",
          "Cam bergamot",
          "Cây xô thơm",
          "Thời gian ở 40 tiếng",
        ],
      },
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
          "Thời gian ở 45 tiếng",
        ],
      },
      {
        id: 3,
        name: "Nến Thơm Bath & Body Works Peppermint Bark 3-Wick",
        price: 499000,
        image: "/assets/images/products/peppermint-bark.jpg",
        description: "Nến thơm với hương bạc hà và socola",
        features: ["Màu Năng", "Socola trắng tan chảy", "Thời gian ở 45 tiếng"],
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
          "Thời gian ở 40 tiếng",
        ],
      },
      {
        id: 5,
        name: "Nến thơm Bath & Body Works FALL APPLE CIDER",
        price: 499000,
        image: "/assets/images/products/fall-apple-cider.jpg",
        description: "Nến thơm với hương táo mùa thu",
        features: ["Màu Năng", "Táo là giảm", "Thời gian ở 40 tiếng"],
      },
    ],
  },
  "nuoc-hoa-co-the": {
    id: 2,
    name: "Nước hoa cơ thể",
    slug: "nuoc-hoa-co-the",
    description: "Nước hoa cơ thể với hương thơm quyến rũ",
    products: [],
  },
  "combo-qua-tang": {
    id: 3,
    name: "Combo quà tặng",
    slug: "combo-qua-tang",
    description: "Bộ sưu tập quà tặng đặc biệt",
    products: [],
  },
};

export async function generateStaticParams() {
  return Object.keys(categories).map((slug) => ({
    slug: slug,
  }));
}

export async function generateMetadata({ params }) {
  const category = categories[params.slug];

  if (!category) {
    return {
      title: "Danh mục không tồn tại - M.O.B",
    };
  }

  return {
    title: `${category.name} - M.O.B`,
    description: category.description,
  };
}

export default function CategoryDetailPage({ params }) {
  const category = categories[params.slug];

  if (!category) {
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
              <span className="text-gray-800">{category.name}</span>
            </nav>
          </div>
        </div>

        {/* Category Header */}
        <div className="py-8">
          <div className="container mx-auto px-4 max-w-6xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-pink-600 mb-4">
              {category.name}
            </h1>
            <p className="text-gray-600 text-lg">{category.description}</p>
          </div>
        </div>

        {/* Products Grid */}
        <ProductGrid products={category.products} />
      </div>
    </PageTransition>
  );
}
