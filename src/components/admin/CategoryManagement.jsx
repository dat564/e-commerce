"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  FolderOutlined,
  EyeOutlined,
  ShoppingOutlined,
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
  Spin,
  notification,
} from "antd";
import { categoriesAPI } from "@/api";
import { useNotification } from "@/contexts/NotificationContext";
import ImageUpload from "@/components/ui/ImageUpload";
import { getCloudinaryUrl } from "@/utils/cloudinaryClient";
import { showError, showSuccess } from "@/utils/notification";

const { Search } = AntInput;
const { TextArea } = Input;

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [statistics, setStatistics] = useState({
    totalCategories: 0,
    activeCategories: 0,
    totalProducts: 0,
  });

  // Load categories from API
  const loadCategories = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const response = await categoriesAPI.getAll({
        page,
        limit: pagination.pageSize,
        search,
      });

      if (response.success) {
        setCategories(response.data.categories);
        setPagination((prev) => ({
          ...prev,
          current: response.data.pagination.page,
          total: response.data.pagination.total,
        }));

        // Update statistics if available
        if (response.data.statistics) {
          setStatistics({
            totalCategories: response.data.statistics.total || 0,
            activeCategories: response.data.statistics.activeCategories || 0,
            totalProducts: response.data.statistics.totalProducts || 0,
          });
        }
      } else {
        showError(
          "Lỗi khi tải danh sách danh mục",
          response.message || "Không thể tải dữ liệu danh mục"
        );
      }
    } catch (error) {
      console.error("Load categories error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Lỗi khi tải danh sách danh mục";
      showError("Lỗi khi tải danh sách danh mục", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Load categories on component mount
  useEffect(() => {
    loadCategories();
  }, []);

  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
    form.resetFields();
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
    form.setFieldsValue({
      name: category.name,
      description: category.description,
      image: category.image,
      status: category.status,
    });
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      setLoading(true);
      const response = await categoriesAPI.delete(categoryId);

      if (response.success) {
        showSuccess(
          "Xóa danh mục thành công",
          "Danh mục đã được xóa khỏi hệ thống"
        );
        loadCategories(pagination.current, searchTerm);
      } else {
        showError(
          "Lỗi khi xóa danh mục",
          response.message || "Không thể xóa danh mục"
        );
      }
    } catch (error) {
      console.error("Delete category error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Lỗi khi xóa danh mục";
      showError("Lỗi khi xóa danh mục", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      // Xử lý dữ liệu trước khi gửi
      const submitData = {
        ...values,
      };

      let response;
      if (editingCategory) {
        response = await categoriesAPI.update(editingCategory._id, submitData);
      } else {
        response = await categoriesAPI.create(submitData);
      }

      if (response.success) {
        if (editingCategory) {
          showSuccess(
            "Cập nhật danh mục thành công",
            "Thông tin danh mục đã được cập nhật"
          );
        } else {
          showSuccess("Thêm danh mục thành công", "Danh mục mới đã được tạo");
        }
        setIsModalOpen(false);
        form.resetFields();
        loadCategories(pagination.current, searchTerm);
      } else {
        showError(
          "Có lỗi xảy ra",
          response.message || "Không thể thực hiện thao tác"
        );
      }
    } catch (error) {
      console.error("Submit category error:", error);
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
    loadCategories(1, value);
  };

  // Handle pagination
  const handleTableChange = (pagination) => {
    setPagination((prev) => ({ ...prev, current: pagination.current }));
    loadCategories(pagination.current, searchTerm);
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
      width: 100,
      align: "center",
      render: (image, record) => (
        <div className="flex justify-center">
          <div className="relative w-12 h-12">
            {image && image.trim() !== "" ? (
              <Image
                src={image}
                alt={record.name}
                fill
                className="object-cover rounded"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 rounded flex items-center justify-center">
                <span className="text-gray-500 text-lg">🕯️</span>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Tên danh mục",
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
      title: "Số sản phẩm",
      dataIndex: "productCount",
      key: "productCount",
      width: 120,
      align: "center",
      render: (count) => (
        <Tag color={count > 0 ? "blue" : "default"}>{count} sản phẩm</Tag>
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
          {status === "active" ? "Hoạt động" : "Ngừng hoạt động"}
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
      width: 200,
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditCategory(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa danh mục"
            description="Bạn có chắc chắn muốn xóa danh mục này?"
            onConfirm={() => {
              handleDeleteCategory(record._id);
            }}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Sử dụng statistics từ state thay vì tính từ categories array
  const { totalCategories, activeCategories, totalProducts } = statistics;

  return (
    <div className="p-6">
      {/* Statistics Cards */}
      <Row gutter={16} className="mb-6">
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng danh mục"
              value={totalCategories}
              prefix={<FolderOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Danh mục hoạt động"
              value={activeCategories}
              prefix={<EyeOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng sản phẩm"
              value={totalProducts}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Card
        title="Quản lý danh mục"
        extra={
          <Space>
            <Search
              placeholder="Tìm kiếm danh mục..."
              allowClear
              style={{ width: 300 }}
              onSearch={handleSearch}
              loading={loading}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddCategory}
            >
              Thêm danh mục
            </Button>
          </Space>
        }
      >
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={categories}
            rowKey="id"
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} danh mục`,
            }}
            onChange={handleTableChange}
          />
        </Spin>
      </Card>

      {/* Modal */}
      <Modal
        title={editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            status: "active",
          }}
        >
          <Form.Item
            name="name"
            label="Tên danh mục"
            rules={[
              { required: true, message: "Vui lòng nhập tên danh mục" },
              { min: 2, message: "Tên phải có ít nhất 2 ký tự" },
            ]}
          >
            <Input placeholder="Nhập tên danh mục" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[
              { required: true, message: "Vui lòng nhập mô tả" },
              { min: 10, message: "Mô tả phải có ít nhất 10 ký tự" },
            ]}
          >
            <TextArea rows={4} placeholder="Nhập mô tả danh mục" />
          </Form.Item>

          <Form.Item name="image" label="Hình ảnh danh mục">
            <ImageUpload
              value={form.getFieldValue("image")}
              onChange={(url) => {
                console.log("image URL", url);
                form.setFieldsValue({ image: url });
              }}
              onUploadError={(error) => {
                console.error("Upload error:", error);
              }}
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Select.Option value="active">Hoạt động</Select.Option>
              <Select.Option value="inactive">Ngừng hoạt động</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item className="mb-0">
            <Space className="w-full justify-end">
              <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingCategory ? "Cập nhật" : "Thêm"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
