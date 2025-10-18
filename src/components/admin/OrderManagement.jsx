"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ShoppingOutlined,
  DollarOutlined,
  FileDoneOutlined,
  ClockCircleOutlined,
  SearchOutlined,
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
  Card,
  Row,
  Col,
  Statistic,
  Input as AntInput,
  Divider,
  Spin,
  Descriptions,
  List,
  Typography,
} from "antd";
import { apiClient } from "@/api/base";
import { showError, showSuccess } from "@/utils/notification";
import { ORDER_STATUS } from "@/constants/orderStatus";

const { Search } = AntInput;
const { TextArea } = Input;
const { Text } = Typography;

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [statistics, setStatistics] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    totalRevenue: 0,
  });

  // Load orders from API
  const loadOrders = async (page = 1, search = "", status = "all") => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: pagination.pageSize,
        search,
      };

      if (status !== "all") {
        params.status = status;
      }

      const response = await apiClient.get("/api/admin/orders", { params });

      if (response.data.success) {
        setOrders(response.data.data.orders);
        setPagination((prev) => ({
          ...prev,
          current: response.data.data.pagination.page,
          total: response.data.data.pagination.total,
        }));

        // Update statistics if available
        if (response.data.data.statistics) {
          setStatistics({
            totalOrders: response.data.data.statistics.total || 0,
            pendingOrders: response.data.data.statistics.pendingOrders || 0,
            deliveredOrders: response.data.data.statistics.deliveredOrders || 0,
            totalRevenue: response.data.data.statistics.totalRevenue || 0,
          });
        }
      } else {
        showError(
          "Lỗi khi tải danh sách đơn hàng",
          response.data.message || "Không thể tải dữ liệu đơn hàng"
        );
      }
    } catch (error) {
      console.error("Load orders error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Lỗi khi tải danh sách đơn hàng";
      showError("Lỗi khi tải danh sách đơn hàng", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Load orders on component mount
  useEffect(() => {
    loadOrders();
  }, []);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
    form.setFieldsValue({
      orderStatus: order.status,
      paymentStatus: order.paymentStatus,
      trackingNumber: order.trackingNumber || "",
    });
  };

  const handleUpdateOrder = async (values) => {
    try {
      setLoading(true);
      // Map orderStatus to status for API compatibility
      const updateData = {
        ...values,
        status: values.orderStatus,
      };
      delete updateData.orderStatus; // Remove the old field name

      const response = await apiClient.put(
        `/api/orders/${selectedOrder._id}`,
        updateData
      );

      if (response.data.success) {
        showSuccess(
          "Cập nhật đơn hàng thành công",
          "Thông tin đơn hàng đã được cập nhật"
        );
        setIsModalOpen(false);
        form.resetFields();
        loadOrders(pagination.current, searchTerm, statusFilter);
      } else {
        showError(
          "Có lỗi xảy ra",
          response.data.message || "Không thể cập nhật đơn hàng"
        );
      }
    } catch (error) {
      console.error("Update order error:", error);
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
    loadOrders(1, value, statusFilter);
  };

  // Handle status filter
  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
    loadOrders(1, searchTerm, value);
  };

  // Handle pagination
  const handleTableChange = (pagination) => {
    setPagination((prev) => ({ ...prev, current: pagination.current }));
    loadOrders(pagination.current, searchTerm, statusFilter);
  };

  // Hàm định dạng trạng thái đơn hàng
  const getOrderStatusTag = (status) => {
    const statusConfig = {
      pending: { color: "gold", text: "Chờ xử lý" },
      confirmed: { color: "blue", text: "Đã xác nhận" },
      processing: { color: "cyan", text: "Đang xử lý" },
      shipped: { color: "purple", text: "Đang giao" },
      delivered: { color: "green", text: "Đã giao" },
      cancelled: { color: "red", text: "Đã hủy" },
    };
    const config = statusConfig[status] || { color: "default", text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // Hàm định dạng trạng thái thanh toán
  const getPaymentStatusTag = (status) => {
    const statusConfig = {
      pending: { color: "gold", text: "Chờ thanh toán" },
      paid: { color: "green", text: "Đã thanh toán" },
      failed: { color: "red", text: "Thất bại" },
      refunded: { color: "orange", text: "Đã hoàn tiền" },
    };
    const config = statusConfig[status] || { color: "default", text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
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
      title: "Mã đơn hàng",
      dataIndex: "orderNumber",
      key: "orderNumber",
      width: 150,
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Khách hàng",
      dataIndex: "user",
      key: "user",
      width: 180,
      render: (user) => (
        <div>
          <div className="font-medium text-gray-900">{user?.name || "N/A"}</div>
          <div className="text-sm text-gray-500">{user?.email || ""}</div>
        </div>
      ),
    },
    {
      title: "Sản phẩm",
      dataIndex: "items",
      key: "items",
      width: 100,
      align: "center",
      render: (items) => <Tag color="blue">{items?.length || 0} sản phẩm</Tag>,
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      key: "total",
      width: 120,
      align: "right",
      render: (total) => (
        <div className="font-semibold text-pink-600">
          {total?.toLocaleString()}đ
        </div>
      ),
    },
    {
      title: "Trạng thái đơn",
      dataIndex: "status",
      key: "status",
      width: 130,
      align: "center",
      render: (status) => getOrderStatusTag(status),
    },
    {
      title: "Thanh toán",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      width: 140,
      align: "center",
      render: (status) => getPaymentStatusTag(status),
    },
    {
      title: "Ngày đặt",
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
        const formattedTime = new Date(date).toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        });
        return (
          <div>
            <div className="text-sm text-gray-900">{formattedDate}</div>
            <div className="text-xs text-gray-500">{formattedTime}</div>
          </div>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      width: 120,
      align: "center",
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleViewOrder(record)}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  // Sử dụng statistics từ state thay vì tính từ orders array
  const { totalOrders, pendingOrders, deliveredOrders, totalRevenue } =
    statistics;

  return (
    <div className="h-full flex flex-col">
      {/* Statistics Cards */}
      <Row gutter={16} className="mb-6">
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng đơn hàng"
              value={totalOrders}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đơn đang xử lý"
              value={pendingOrders}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đơn đã giao"
              value={deliveredOrders}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Doanh thu"
              value={totalRevenue}
              prefix={<DollarOutlined />}
              valueStyle={{ color: "#cf1322" }}
              formatter={(value) => `${value.toLocaleString()}đ`}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Card
        title="Quản lý đơn hàng"
        extra={
          <Space>
            <Select
              value={statusFilter}
              onChange={handleStatusFilter}
              style={{ width: 180 }}
              options={[
                { value: "all", label: "Tất cả trạng thái" },
                { value: "pending", label: "Chờ xử lý" },
                { value: "confirmed", label: "Đã xác nhận" },
                { value: "processing", label: "Đang xử lý" },
                { value: "shipped", label: "Đang giao" },
                { value: "delivered", label: "Đã giao" },
                { value: "cancelled", label: "Đã hủy" },
              ]}
            />
            <Search
              placeholder="Tìm kiếm mã đơn hàng..."
              allowClear
              style={{ width: 250 }}
              onSearch={handleSearch}
              loading={loading}
            />
          </Space>
        }
        className="flex-1 flex flex-col"
        bodyStyle={{ flex: 1, display: "flex", flexDirection: "column" }}
      >
        <Spin spinning={loading} className="flex-1 flex flex-col">
          <Table
            columns={columns}
            dataSource={orders}
            rowKey="_id"
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} đơn hàng`,
            }}
            onChange={handleTableChange}
            scroll={{ x: 1200, y: "calc(100vh - 400px)" }}
            className="flex-1"
          />
        </Spin>
      </Card>

      {/* Order Detail Modal */}
      <Modal
        title={`Chi tiết đơn hàng #${selectedOrder?.orderNumber || ""}`}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        width={900}
      >
        {selectedOrder && (
          <div>
            {/* Customer Info */}
            <Descriptions
              title="Thông tin khách hàng"
              bordered
              size="small"
              column={2}
            >
              <Descriptions.Item label="Tên khách hàng">
                {selectedOrder.user?.name || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {selectedOrder.user?.email || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {selectedOrder.shippingAddress?.phone || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ" span={2}>
                {`${selectedOrder.shippingAddress?.address}, ${selectedOrder.shippingAddress?.ward}, ${selectedOrder.shippingAddress?.district}, ${selectedOrder.shippingAddress?.city}` ||
                  "N/A"}
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            {/* Products List */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-3">Sản phẩm</h3>
              <List
                dataSource={selectedOrder.items}
                renderItem={(item) => (
                  <List.Item>
                    <div className="flex items-center space-x-4 w-full">
                      <div className="relative w-16 h-16">
                        {item.product?.images?.[0] ? (
                          <Image
                            src={item.product.images[0]}
                            alt={item.product?.name || "Product"}
                            fill
                            className="object-cover rounded"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-gray-400">🕯️</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">
                          {item.product?.name || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          Số lượng: {item.quantity} ×{" "}
                          {item.price?.toLocaleString()}đ
                        </div>
                      </div>
                      <div className="font-semibold text-pink-600">
                        {(item.quantity * item.price)?.toLocaleString()}đ
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </div>

            <Divider />

            {/* Order Summary */}
            <div className="mb-4">
              <Row gutter={16}>
                <Col span={12}>
                  <Descriptions
                    title="Chi tiết đơn hàng"
                    bordered
                    size="small"
                    column={1}
                  >
                    <Descriptions.Item label="Tổng phụ">
                      {selectedOrder.subtotal?.toLocaleString()}đ
                    </Descriptions.Item>
                    <Descriptions.Item label="Phí vận chuyển">
                      {selectedOrder.shippingFee?.toLocaleString()}đ
                    </Descriptions.Item>
                    <Descriptions.Item label="Giảm giá">
                      {selectedOrder.discount?.toLocaleString()}đ
                    </Descriptions.Item>
                    <Descriptions.Item label="Tổng cộng">
                      <Text strong className="text-pink-600 text-lg">
                        {selectedOrder.total?.toLocaleString()}đ
                      </Text>
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
                <Col span={12}>
                  <Descriptions
                    title="Thông tin khác"
                    bordered
                    size="small"
                    column={1}
                  >
                    <Descriptions.Item label="Phương thức thanh toán">
                      {selectedOrder.paymentMethod === "cod"
                        ? "Thanh toán khi nhận hàng"
                        : selectedOrder.paymentMethod === "bank_transfer"
                        ? "Chuyển khoản"
                        : "Thẻ tín dụng"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ghi chú">
                      {selectedOrder.notes || "Không có"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Mã vận đơn">
                      {selectedOrder.trackingNumber || "Chưa có"}
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
              </Row>
            </div>

            <Divider />

            {/* Update Form */}
            <Form form={form} layout="vertical" onFinish={handleUpdateOrder}>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="orderStatus"
                    label="Trạng thái đơn hàng"
                    rules={[
                      { required: true, message: "Vui lòng chọn trạng thái" },
                    ]}
                  >
                    <Select>
                      <Select.Option value="pending">Chờ xử lý</Select.Option>
                      <Select.Option value="confirmed">
                        Đã xác nhận
                      </Select.Option>
                      <Select.Option value="processing">
                        Đang xử lý
                      </Select.Option>
                      <Select.Option value="shipped">Đang giao</Select.Option>
                      <Select.Option value="delivered">Đã giao</Select.Option>
                      <Select.Option value="cancelled">Đã hủy</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="paymentStatus"
                    label="Trạng thái thanh toán"
                    rules={[
                      { required: true, message: "Vui lòng chọn trạng thái" },
                    ]}
                  >
                    <Select>
                      <Select.Option value="pending">
                        Chờ thanh toán
                      </Select.Option>
                      <Select.Option value="paid">Đã thanh toán</Select.Option>
                      <Select.Option value="failed">Thất bại</Select.Option>
                      <Select.Option value="refunded">
                        Đã hoàn tiền
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="trackingNumber" label="Mã vận đơn">
                    <Input placeholder="Nhập mã vận đơn" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item>
                <Space className="w-full justify-end">
                  <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    Cập nhật
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
}
