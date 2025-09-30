# Image Upload Components

Bộ component upload ảnh hỗ trợ upload đơn lẻ và nhiều ảnh lên Cloudinary.

## Components

### 1. ImageUpload

Component upload ảnh linh hoạt, hỗ trợ cả upload đơn lẻ và nhiều ảnh.

#### Props

- `multiple` (boolean): Cho phép upload nhiều ảnh (default: false)
- `maxCount` (number): Số lượng ảnh tối đa khi multiple = true (default: 5)
- `uploadMode` (string): "sequential" hoặc "parallel" (default: "sequential")
- `maxSize` (number): Kích thước file tối đa tính bằng MB (default: 10)
- `accept` (string): Loại file được chấp nhận (default: "image/\*")
- `value`: URL (single) hoặc array of URLs (multiple)
- `onChange`: Callback khi có ảnh mới
- `onUploadSuccess`: Callback khi upload thành công
- `onUploadError`: Callback khi upload thất bại

#### Sử dụng

```jsx
// Upload 1 ảnh
<ImageUpload
  value={singleImage}
  onChange={setSingleImage}
/>

// Upload nhiều ảnh (tuần tự)
<ImageUpload
  multiple={true}
  maxCount={5}
  uploadMode="sequential"
  value={multipleImages}
  onChange={setMultipleImages}
/>

// Upload nhiều ảnh (song song)
<ImageUpload
  multiple={true}
  maxCount={5}
  uploadMode="parallel"
  value={multipleImages}
  onChange={setMultipleImages}
/>
```

### 2. MultipleImageUpload

Component chuyên dụng cho upload nhiều ảnh với UI tối ưu.

#### Props

- `maxCount` (number): Số lượng ảnh tối đa (default: 10)
- `uploadMode` (string): "sequential" hoặc "parallel" (default: "sequential")
- `maxConcurrent` (number): Số lượng upload đồng thời tối đa (default: 3)
- `maxSize` (number): Kích thước file tối đa tính bằng MB (default: 10)
- `accept` (string): Loại file được chấp nhận (default: "image/\*")
- `value`: Array of URLs
- `onChange`: Callback khi có ảnh mới
- `onUploadSuccess`: Callback khi upload thành công
- `onUploadError`: Callback khi upload thất bại

#### Sử dụng

```jsx
<MultipleImageUpload
  maxCount={8}
  uploadMode="parallel"
  maxConcurrent={2}
  onUploadSuccess={(result) => {
    console.log("Upload success:", result);
  }}
/>
```

## Upload Functions

### 1. uploadMultipleToCloudinary

Upload nhiều ảnh tuần tự (an toàn, ít tải server).

```javascript
import { uploadMultipleToCloudinary } from "@/utils/cloudinaryUpload";

const result = await uploadMultipleToCloudinary(
  files,
  "ecommerce", // folder
  (totalProgress) => {
    console.log("Total progress:", totalProgress);
  },
  (fileIndex, fileName, fileProgress) => {
    console.log(`File ${fileName}: ${fileProgress}%`);
  }
);
```

### 2. uploadMultipleToCloudinaryParallel

Upload nhiều ảnh song song (nhanh hơn nhưng có thể gây quá tải).

```javascript
import { uploadMultipleToCloudinaryParallel } from "@/utils/cloudinaryUpload";

const result = await uploadMultipleToCloudinaryParallel(
  files,
  "ecommerce", // folder
  (totalProgress) => {
    console.log("Total progress:", totalProgress);
  },
  (fileIndex, fileName, fileProgress) => {
    console.log(`File ${fileName}: ${fileProgress}%`);
  },
  3 // maxConcurrent
);
```

## Kết quả trả về

```javascript
{
  results: [
    {
      public_id: "ecommerce/abc123",
      url: "https://res.cloudinary.com/...",
      width: 1920,
      height: 1080,
      format: "jpg",
      bytes: 123456,
      originalFilename: "image1.jpg",
      originalName: "image1.jpg",
      index: 0
    }
  ],
  errors: [],
  successCount: 1,
  errorCount: 0,
  totalFiles: 1
}
```

## Tính năng

- ✅ Upload đơn lẻ và nhiều ảnh
- ✅ Progress tracking cho từng file riêng biệt
- ✅ Validation file (type, size)
- ✅ Upload tuần tự và song song
- ✅ Error handling chi tiết
- ✅ UI responsive với Ant Design
- ✅ Preview ảnh trước khi upload
- ✅ Remove ảnh đã upload
- ✅ Thông báo kết quả upload

## Demo

Sử dụng component `ImageUploadDemo` để test các tính năng:

```jsx
import { ImageUploadDemo } from "@/components/ui";

<ImageUploadDemo />;
```
