import { notFound } from "next/navigation";
import ProductImageGallery from "@/components/products/ProductImageGallery";
import ProductInfo from "@/components/products/ProductInfo";
import ProductTabs from "@/components/products/ProductTabs";
import RelatedProducts from "@/components/products/RelatedProducts";
import AIAssistant from "@/components/products/AIAssistant";
import PageTransition from "@/components/PageTransition";
import LoadingLink from "@/components/LoadingLink";
import { serverAPI } from "@/api/server";

// Function to fetch product data from API
async function getProduct(id) {
  try {
    const response = await serverAPI.products.getById(id);
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

// Function to fetch related products from API
async function getRelatedProducts(categoryId, currentProductId) {
  try {
    const response = await serverAPI.products.getAll({
      category: categoryId,
      limit: 4,
      exclude: currentProductId,
    });
    return response.data?.products || [];
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
}

export async function generateStaticParams() {
  try {
    // Fetch all products to generate static params
    const response = await serverAPI.products.getAll({ limit: 100 });
    const products = response.data?.products || [];

    return products.map((product) => ({
      id: product.id,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const product = await getProduct(params.id);

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

export default async function ProductDetailPage({ params }) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  // Fetch related products
  const relatedProducts = await getRelatedProducts(
    product.category?.id || product.category,
    product.id
  );

  return (
    <PageTransition>
      <div className="min-h-[600px] bg-white">
        {/* Breadcrumb */}
        <div className="bg-gray-100 py-3">
          <div className="container mx-auto px-4 max-w-6xl">
            <nav className="text-sm text-gray-600">
              <LoadingLink
                href="/"
                className="hover:text-pink-600 cursor-pointer"
                loadingText="Đang chuyển về trang chủ..."
              >
                Trang chủ
              </LoadingLink>
              <span className="mx-2">/</span>
              <LoadingLink
                href="/categories"
                className="hover:text-pink-600 cursor-pointer"
                loadingText="Đang chuyển đến danh mục..."
              >
                Danh mục sản phẩm
              </LoadingLink>
              <span className="mx-2">/</span>
              <LoadingLink
                href={`/categories/${product.category?.name
                  .toLowerCase()
                  .replace(/\s+/g, "-")
                  .replace(/[^a-z0-9-]/g, "")}`}
                className="hover:text-pink-600 cursor-pointer"
                loadingText="Đang chuyển đến danh mục..."
              >
                {product.category?.name || product.category}
              </LoadingLink>
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
        {relatedProducts && relatedProducts.length > 0 && (
          <RelatedProducts products={relatedProducts} />
        )}

        {/* AI Assistant */}
        <AIAssistant product={product} />
      </div>
    </PageTransition>
  );
}
