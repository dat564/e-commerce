import LoadingSpinner from "@/components/LoadingSpinner";

export default function ProductLoading() {
  return (
    <div className="min-h-[600px] bg-white">
      {/* Breadcrumb Skeleton */}
      <div className="bg-gray-100 py-3">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery Skeleton */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-200 rounded-xl animate-pulse"></div>
              <div className="flex space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse"
                  ></div>
                ))}
              </div>
            </div>

            {/* Product Info Skeleton */}
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
              <div className="flex space-x-4">
                <div className="h-12 bg-gray-200 rounded flex-1 animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded flex-1 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8">
              <div className="h-12 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded w-24 animate-pulse"></div>
            </div>
          </div>
          <div className="py-6">
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Skeleton */}
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-8 animate-pulse"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="h-64 bg-gray-200 animate-pulse"></div>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
