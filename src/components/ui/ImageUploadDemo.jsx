import React, { useState } from "react";
import { Card, Space, Typography, Divider, Row, Col } from "antd";
import ImageUpload from "./ImageUpload";
import MultipleImageUpload from "./MultipleImageUpload";

const { Title, Text } = Typography;

const ImageUploadDemo = () => {
  const [singleImage, setSingleImage] = useState(null);
  const [multipleImages, setMultipleImages] = useState([]);
  const [multipleImagesParallel, setMultipleImagesParallel] = useState([]);

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>Demo Upload Ảnh</Title>

      <Row gutter={[16, 16]}>
        {/* Single Image Upload */}
        <Col xs={24} lg={12}>
          <Card title="Upload 1 ảnh" size="small">
            <ImageUpload
              value={singleImage}
              onChange={setSingleImage}
              onUploadSuccess={(result) => {
                console.log("Single upload success:", result);
              }}
              onUploadError={(error) => {
                console.error("Single upload error:", error);
              }}
            />
            <Divider />
            <Text strong>Kết quả:</Text>
            <pre style={{ fontSize: "12px", marginTop: "8px" }}>
              {JSON.stringify(singleImage, null, 2)}
            </pre>
          </Card>
        </Col>

        {/* Multiple Image Upload - Sequential */}
        <Col xs={24} lg={12}>
          <Card title="Upload nhiều ảnh (Tuần tự)" size="small">
            <ImageUpload
              multiple={true}
              maxCount={5}
              uploadMode="sequential"
              value={multipleImages}
              onChange={setMultipleImages}
              onUploadSuccess={(result) => {
                console.log("Multiple sequential upload success:", result);
              }}
              onUploadError={(error) => {
                console.error("Multiple sequential upload error:", error);
              }}
            />
            <Divider />
            <Text strong>Kết quả:</Text>
            <pre style={{ fontSize: "12px", marginTop: "8px" }}>
              {JSON.stringify(multipleImages, null, 2)}
            </pre>
          </Card>
        </Col>

        {/* Multiple Image Upload - Parallel */}
        <Col xs={24} lg={12}>
          <Card title="Upload nhiều ảnh (Song song)" size="small">
            <ImageUpload
              multiple={true}
              maxCount={5}
              uploadMode="parallel"
              value={multipleImagesParallel}
              onChange={setMultipleImagesParallel}
              onUploadSuccess={(result) => {
                console.log("Multiple parallel upload success:", result);
              }}
              onUploadError={(error) => {
                console.error("Multiple parallel upload error:", error);
              }}
            />
            <Divider />
            <Text strong>Kết quả:</Text>
            <pre style={{ fontSize: "12px", marginTop: "8px" }}>
              {JSON.stringify(multipleImagesParallel, null, 2)}
            </pre>
          </Card>
        </Col>

        {/* Dedicated Multiple Image Upload Component */}
        <Col xs={24} lg={12}>
          <Card title="MultipleImageUpload Component" size="small">
            <MultipleImageUpload
              maxCount={8}
              uploadMode="parallel"
              maxConcurrent={2}
              onUploadSuccess={(result) => {
                console.log("Dedicated multiple upload success:", result);
              }}
              onUploadError={(error) => {
                console.error("Dedicated multiple upload error:", error);
              }}
            />
          </Card>
        </Col>
      </Row>

      <Divider />

      <Card title="Hướng dẫn sử dụng" size="small">
        <Space direction="vertical" style={{ width: "100%" }}>
          <div>
            <Text strong>1. Upload 1 ảnh:</Text>
            <Text code>
              {"<ImageUpload value={image} onChange={setImage} />"}
            </Text>
          </div>

          <div>
            <Text strong>2. Upload nhiều ảnh (tuần tự):</Text>
            <Text code>
              {
                '<ImageUpload multiple={true} maxCount={5} uploadMode="sequential" />'
              }
            </Text>
          </div>

          <div>
            <Text strong>3. Upload nhiều ảnh (song song):</Text>
            <Text code>
              {
                '<ImageUpload multiple={true} maxCount={5} uploadMode="parallel" />'
              }
            </Text>
          </div>

          <div>
            <Text strong>4. Sử dụng component chuyên dụng:</Text>
            <Text code>
              {
                '<MultipleImageUpload maxCount={10} uploadMode="parallel" maxConcurrent={3} />'
              }
            </Text>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default ImageUploadDemo;
