"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  DollarOutlined,
  ShoppingOutlined,
  StarOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Table,
  Space,
  Tag,
  message,
  Popconfirm,
  Card,
  Row,
  Col,
  Statistic,
  Input as AntInput,
  InputNumber,
  Upload,
  Divider,
  Spin,
  notification,
} from "antd";
import { productsAPI, categoriesAPI } from "@/api";
import { useNotification } from "@/contexts/NotificationContext";
import { showError, showSuccess } from "@/utils/notification";
import ImageUpload from "@/components/ui/ImageUpload";

const { Search } = AntInput;
const { TextArea } = Input;

export default function ProductManagement() {
  const api = useNotification();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Load products from API
  const loadProducts = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll({
        page,
        limit: pagination.pageSize,
        search,
      });

      if (response.success) {
        console.log("Products response:", response.data.products);
        setProducts(response.data.products);
        setPagination((prev) => ({
          ...prev,
          current: response.data.pagination.page,
          total: response.data.pagination.total,
        }));
      } else {
        showError(
          "Lỗi khi tải danh sách sản phẩm",
          response.message || "Không thể tải dữ liệu sản phẩm"
        );
      }
    } catch (error) {
      console.error("Load products error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Lỗi khi tải danh sách sản phẩm";
      showError("Lỗi khi tải danh sách sản phẩm", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Load categories from API
  const loadCategories = async () => {
    try {
      console.log("Loading categories...");
      const response = await categoriesAPI.getAll();
      console.log("Categories response:", response);
      if (response.success) {
        console.log("Categories data:", response.data.categories);
        setCategories(response.data.categories);
      } else {
        console.error("Load categories failed:", response.message);
      }
    } catch (error) {
      console.error("Load categories error:", error);
      showError(
        "Lỗi khi tải danh sách thể loại",
        "Không thể tải danh sách thể loại"
      );
    }
  };

  // Load products on component mount
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
    form.resetFields();
  };

  const handleEditProduct = (product) => {
    console.log("Editing product:", product);
    setEditingProduct(product);
    setIsModalOpen(true);
    form.setFieldsValue({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category?._id || product.category,
      image: product.image,
      images: product.images || [],
      features: product.features?.join("\n") || "",
      stock: product.stock,
      status: product.status,
    });
  };

  const handleDeleteProduct = async (productId) => {
    try {
      setLoading(true);
      const response = await productsAPI.delete(productId);

      if (response.success) {
        showSuccess(
          "Xóa sản phẩm thành công",
          "Sản phẩm đã được xóa khỏi hệ thống"
        );
        loadProducts(pagination.current, searchTerm);
        loadCategories(); // Refresh categories in case any were affected
      } else {
        showError(
          "Lỗi khi xóa sản phẩm",
          response.message || "Không thể xóa sản phẩm"
        );
      }
    } catch (error) {
      console.error("Delete product error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Lỗi khi xóa sản phẩm";
      showError("Lỗi khi xóa sản phẩm", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      // Convert features string to array
      const features = values.features
        ? values.features.split("\n").filter((f) => f.trim())
        : [];

      const productData = {
        ...values,
        features,
      };

      let response;
      console.log("editingProduct", editingProduct);
      if (editingProduct) {
        response = await productsAPI.update(editingProduct.id, productData);
      } else {
        response = await productsAPI.create(productData);
      }

      if (response.success) {
        if (editingProduct) {
          showSuccess(
            "Cập nhật sản phẩm thành công",
            "Thông tin sản phẩm đã được cập nhật"
          );
        } else {
          showSuccess("Thêm sản phẩm thành công", "Sản phẩm mới đã được tạo");
        }
        setIsModalOpen(false);
        form.resetFields();
        loadProducts(pagination.current, searchTerm);
        loadCategories(); // Refresh categories in case new ones were added
      } else {
        showError(
          "Có lỗi xảy ra",
          response.message || "Không thể thực hiện thao tác"
        );
      }
    } catch (error) {
      console.error("Submit product error:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Có lỗi xảy ra";
      showError("Có lỗi xảy ra", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
    loadProducts(1, value);
    loadCategories(); // Refresh categories in case any were affected
  };

  // Handle pagination
  const handleTableChange = (pagination) => {
    setPagination((prev) => ({ ...prev, current: pagination.current }));
    loadProducts(pagination.current, searchTerm);
    loadCategories(); // Refresh categories in case any were affected
  };

  const columns = [
    {
      title: "STT",
      key: "stt",
      width: 60,
      align: "center",
      render: (_, __, index) => {
        const current = pagination.current || 1;
        const pageSize = pagination.pageSize || 10;
        return (current - 1) * pageSize + index + 1;
      },
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      width: 120,
      align: "center",
      render: (image, record) => {
        const images = record.images || [];
        const hasImages = (image && image.trim() !== "") || images.length > 0;
        const displayImage = image || images[0];

        return (
          <div className="flex justify-center">
            <div className="relative w-12 h-12">
              {hasImages && displayImage ? (
                <Image
                  src={displayImage}
                  alt={record.name}
                  fill
                  className="object-cover rounded"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-gray-400 text-lg">🕯️</span>
                </div>
              )}
              {images.length > 1 && (
                <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  +{images.length}
                </div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (text) => <div className="font-medium text-gray-900">{text}</div>,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: 250,
      ellipsis: true,
      render: (text) => <div className="text-gray-600 text-sm">{text}</div>,
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      width: 120,
      align: "center",
      render: (price) => (
        <div className="font-semibold text-pink-600">
          {price.toLocaleString()}đ
        </div>
      ),
    },
    {
      title: "Thể loại",
      dataIndex: "category",
      key: "category",
      width: 120,
      align: "center",
      render: (category) => (
        <Tag color="blue">{category?.name || category}</Tag>
      ),
    },
    {
      title: "Tồn kho",
      dataIndex: "stock",
      key: "stock",
      width: 100,
      align: "center",
      render: (stock) => (
        <Tag color={stock > 0 ? "green" : "red"}>{stock} sản phẩm</Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center",
      render: (status) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status === "active" ? "Hoạt động" : "Ngừng bán"}
        </Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (date) => {
        if (!date) return "-";
        const formattedDate = new Date(date).toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
        return <div className="text-sm text-gray-600">{formattedDate}</div>;
      },
    },
    {
      title: "Hành động",
      key: "action",
      width: 180,
      align: "center",
      render: (_, record) => (
        <Space size="small" wrap>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditProduct(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa sản phẩm"
            description="Bạn có chắc chắn muốn xóa sản phẩm này?"
            onConfirm={() => handleDeleteProduct(record._id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const totalProducts = products.length;
  const activeProducts = products.filter(
    (product) => product.status === "active"
  ).length;
  const totalValue = products.reduce(
    (sum, product) => sum + product.price * product.stock,
    0
  );

  return (
    <div className="p-6">
      {/* Statistics Cards */}
      <Row gutter={16} className="mb-6">
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng sản phẩm"
              value={totalProducts}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Sản phẩm hoạt động"
              value={activeProducts}
              prefix={<StarOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng giá trị kho"
              value={totalValue}
              prefix={<DollarOutlined />}
              valueStyle={{ color: "#cf1322" }}
              formatter={(value) => `${value.toLocaleString()}đ`}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Card
        title="Quản lý sản phẩm"
        extra={
          <Space>
            <Search
              placeholder="Tìm kiếm sản phẩm..."
              allowClear
              style={{ width: 300 }}
              onSearch={handleSearch}
              loading={loading}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddProduct}
            >
              Thêm sản phẩm
            </Button>
          </Space>
        }
      >
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={products}
            rowKey="id"
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} sản phẩm`,
            }}
            onChange={handleTableChange}
          />
        </Spin>
      </Card>

      {/* Modal */}
      <Modal
        title={editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            status: "active",
            stock: 0,
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Tên sản phẩm"
                rules={[
                  { required: true, message: "Vui lòng nhập tên sản phẩm" },
                  { min: 2, message: "Tên phải có ít nhất 2 ký tự" },
                ]}
              >
                <Input placeholder="Nhập tên sản phẩm" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="price"
                label="Giá (VNĐ)"
                rules={[
                  { required: true, message: "Vui lòng nhập giá" },
                  { type: "number", min: 0, message: "Giá phải lớn hơn 0" },
                ]}
              >
                <InputNumber
                  placeholder="Nhập giá"
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[
              { required: true, message: "Vui lòng nhập mô tả" },
              { min: 10, message: "Mô tả phải có ít nhất 10 ký tự" },
            ]}
          >
            <TextArea rows={4} placeholder="Nhập mô tả sản phẩm" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Thể loại"
                rules={[{ required: true, message: "Vui lòng chọn thể loại" }]}
              >
                <Select placeholder="Chọn thể loại" loading={loading}>
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <Select.Option key={category._id} value={category._id}>
                        {category.name}
                      </Select.Option>
                    ))
                  ) : (
                    <Select.Option disabled value="">
                      Chưa có thể loại nào
                    </Select.Option>
                  )}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="stock"
                label="Số lượng tồn kho"
                rules={[
                  { required: true, message: "Vui lòng nhập số lượng" },
                  {
                    type: "number",
                    min: 0,
                    message: "Số lượng phải lớn hơn hoặc bằng 0",
                  },
                ]}
              >
                <InputNumber
                  placeholder="Nhập số lượng"
                  style={{ width: "100%" }}
                  min={0}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="image" label="Hình ảnh chính">
            <ImageUpload
              value={form.getFieldValue("image")}
              onChange={(url) => {
                form.setFieldsValue({ image: url });
              }}
              onUploadError={(error) => {
                console.error("Upload error:", error);
              }}
            />
          </Form.Item>

          <Form.Item name="images" label="Thư viện ảnh (nhiều ảnh)">
            <ImageUpload
              multiple={true}
              maxCount={10}
              value={form.getFieldValue("images") || []}
              onChange={(urls) => {
                form.setFieldsValue({ images: urls });
              }}
              onUploadError={(error) => {
                console.error("Upload error:", error);
              }}
            />
          </Form.Item>

          <Form.Item name="features" label="Tính năng (mỗi dòng một tính năng)">
            <TextArea
              rows={3}
              placeholder="Hương lavender&#10;Thời gian cháy 40h&#10;Sáp đậu nành"
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Select.Option value="active">Hoạt động</Select.Option>
              <Select.Option value="inactive">Ngừng bán</Select.Option>
            </Select>
          </Form.Item>

          <Divider />

          <Form.Item className="mb-0">
            <Space className="w-full justify-end">
              <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                {editingProduct ? "Cập nhật" : "Thêm"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
