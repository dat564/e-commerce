"use client";

import { useState, useEffect, useRef } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  UserOutlined,
  MailOutlined,
  CrownOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
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
import { usersAPI } from "@/api";
import { useNotification } from "@/contexts/NotificationContext";

const { Search } = AntInput;

export default function UserManagement() {
  const api = useNotification();
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [statistics, setStatistics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    adminUsers: 0,
  });
  const hasLoadedRef = useRef(false);

  // Load statistics from API
  const loadStatistics = async () => {
    try {
      const response = await usersAPI.getAll({
        page: 1,
        limit: 1, // Chỉ cần lấy 1 record để lấy tổng số
      });

      if (response.success) {
        const { total, activeUsers, adminUsers } =
          response.data.statistics || {};
        setStatistics({
          totalUsers: total || 0,
          activeUsers: activeUsers || 0,
          adminUsers: adminUsers || 0,
        });
      }
    } catch (error) {
      console.error("Load statistics error:", error);
    }
  };

  // Load users from API
  const loadUsers = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const response = await usersAPI.getAll({
        page,
        limit: pagination.pageSize,
        search,
      });

      if (response.success) {
        setUsers(response.data.users);
        setPagination((prev) => ({
          ...prev,
          current: response.data.pagination.page,
          total: response.data.pagination.total,
        }));
      } else {
        api.error({
          message: "Lỗi khi tải danh sách người dùng",
          description: response.message || "Không thể tải dữ liệu người dùng",
        });
      }
    } catch (error) {
      console.error("Load users error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Lỗi khi tải danh sách người dùng";
      api.error({
        message: "Lỗi khi tải danh sách người dùng",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  // Load users and statistics on component mount
  useEffect(() => {
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true;
      loadUsers();
      loadStatistics();
    }
  }, []);

  const handleAddUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
    form.resetFields();
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    });
  };

  const handleDeleteUser = async (userId) => {
    try {
      setLoading(true);
      const response = await usersAPI.delete(userId);

      if (response.success) {
        api.success({
          message: "Xóa người dùng thành công",
          description: "Người dùng đã được xóa khỏi hệ thống",
        });
        loadUsers(pagination.current, searchTerm);
        loadStatistics();
      } else {
        api.error({
          message: "Lỗi khi xóa người dùng",
          description: response.message || "Không thể xóa người dùng",
        });
      }
    } catch (error) {
      console.error("Delete user error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Lỗi khi xóa người dùng";
      api.error({
        message: "Lỗi khi xóa người dùng",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      let response;
      if (editingUser) {
        response = await usersAPI.update(
          editingUser._id || editingUser.id,
          values
        );
      } else {
        // Thêm password mặc định khi tạo user mới
        const userData = {
          ...values,
          password: "mob123",
        };
        response = await usersAPI.create(userData);
      }

      if (response.success) {
        if (editingUser) {
          api.success({
            message: "Cập nhật người dùng thành công",
            description: "Thông tin người dùng đã được cập nhật",
          });
        } else {
          const defaultPassword = response.data?.defaultPassword || "mob123";
          api.success({
            message: "Thêm người dùng thành công",
            description: `Mật khẩu mặc định: ${defaultPassword}`,
          });
        }
        setIsModalOpen(false);
        form.resetFields();
        loadUsers(pagination.current, searchTerm);
        loadStatistics();
      } else {
        api.error({
          message: response.message || "Không thể thực hiện thao tác",
        });
      }
    } catch (error) {
      console.error("Submit user error:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Có lỗi xảy ra";
      api.error({
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
    loadUsers(1, value);
  };

  // Handle pagination
  const handleTableChange = (pagination) => {
    setPagination((prev) => ({ ...prev, current: pagination.current }));
    loadUsers(pagination.current, searchTerm);
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
      title: "Tên",
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (text, record) => (
        <Space>
          <UserOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 250,
      render: (text) => (
        <Space>
          <MailOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      width: 120,
      align: "center",
      render: (role) => (
        <Tag
          color={role === "admin" ? "red" : "blue"}
          icon={role === "admin" ? <CrownOutlined /> : <UserOutlined />}
        >
          {role === "admin" ? "Quản trị viên" : "Người dùng"}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      width: 120,
      align: "center",
      render: (isActive) => (
        <Tag
          color={isActive ? "green" : "red"}
          icon={isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
        >
          {isActive ? "Hoạt động" : "Không hoạt động"}
        </Tag>
      ),
    },
    {
      title: "Ngày tham gia",
      dataIndex: "joinDate",
      key: "joinDate",
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
      title: "Lần đăng nhập cuối",
      dataIndex: "lastLogin",
      key: "lastLogin",
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
      width: 150,
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditUser(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa người dùng"
            description="Bạn có chắc chắn muốn xóa người dùng này?"
            onConfirm={() => handleDeleteUser(record._id || record.id)}
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

  // Sử dụng statistics từ state thay vì tính từ users array
  const { totalUsers, activeUsers, adminUsers } = statistics;

  return (
    <div className="p-6">
      {/* Statistics Cards */}
      <Row gutter={16} className="mb-6">
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng người dùng"
              value={totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Người dùng hoạt động"
              value={activeUsers}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Quản trị viên"
              value={adminUsers}
              prefix={<CrownOutlined />}
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Card
        title="Quản lý người dùng"
        extra={
          <Space>
            <Search
              placeholder="Tìm kiếm người dùng..."
              allowClear
              style={{ width: 300 }}
              onSearch={handleSearch}
              loading={loading}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddUser}
            >
              Thêm người dùng
            </Button>
          </Space>
        }
      >
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={users}
            rowKey={(record) => record.id || record._id || record.email}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} người dùng`,
            }}
            onChange={handleTableChange}
          />
        </Spin>
      </Card>

      {/* Modal */}
      <Modal
        title={editingUser ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        {!editingUser && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              <strong>Lưu ý:</strong> Người dùng mới sẽ có mật khẩu mặc định là{" "}
              <code className="bg-blue-100 px-1 rounded">mob123</code>
            </p>
          </div>
        )}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            role: "user",
            isActive: true,
          }}
        >
          <Form.Item
            name="name"
            label="Tên"
            rules={[
              { required: true, message: "Vui lòng nhập tên" },
              { min: 2, message: "Tên phải có ít nhất 2 ký tự" },
            ]}
          >
            <Input placeholder="Nhập tên người dùng" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>

          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
          >
            <Select placeholder="Chọn vai trò">
              <Select.Option value="user">Người dùng</Select.Option>
              <Select.Option value="admin">Quản trị viên</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="isActive"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Select.Option value={true}>Hoạt động</Select.Option>
              <Select.Option value={false}>Không hoạt động</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item className="mb-0">
            <Space className="w-full justify-end">
              <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                {editingUser ? "Cập nhật" : "Thêm"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
