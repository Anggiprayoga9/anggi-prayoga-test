"use client";

import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import {
    Button,
    Form,
    Input,
    InputNumber,
    Modal,
    Pagination,
    Space,
    Spin,
    Typography,
    message,
} from "antd";
import Table, { ColumnsType } from "antd/es/table";
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Product } from "../type/product";
import { debounce } from "../utils/debounce";

export default function ProductsPage() {
  const { Title, Text } = Typography;
  const { Search } = Input;
  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<Product | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"create" | "edit">("create");
  const [form] = Form.useForm();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Fetch list products
  const fetchProducts = useCallback(async (search?: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/api/products", {
        params: search ? { search } : {},
      });
      const apiData = res.data?.data || [];
      setProducts(apiData);
    } catch (err) {
      console.error("Failed to fetch:", err);
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter data based on search value
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  //   Debounce search handler
  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        fetchProducts(value);
      }, 300),
    [fetchProducts]
  );

  //   searchValue change handler
  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    setCurrentPage(1);
    if (!value) {
      fetchProducts();
    } else {
      debouncedSearch(value);
    }
  };

  const columns: ColumnsType<Product> = [
    {
      title: "Product Title",
      dataIndex: "product_title",
      key: "product_title",
    },
    {
      title: "Price",
      dataIndex: "product_price",
      key: "product_price",
      render: (price: number) => `Rp ${price.toLocaleString("id-ID")}`,
    },
    {
      title: "Category",
      dataIndex: "product_category",
      key: "product_category",
    },
    {
      title: "Description",
      dataIndex: "product_description",
      key: "product_description",
      render: (desc?: string) =>
        desc ? (desc.length > 30 ? desc.slice(0, 30) + "..." : desc) : "-",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => openModal("edit", record)}
          >
            Edit
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() =>
              handleDelete(record.product_id, record.product_title)
            }
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  //   Add or update product submit handler
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (modalType === "create") {
        // Create product
        await axios.post("/api/product", values);
      } else if (modalType === "edit" && selected) {
        // Update product
        await axios.put("/api/product", {
          ...values,
          product_id: selected.product_id,
        });
      }

      fetchProducts();
      setIsModalOpen(false);
      form.resetFields();
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type: "create" | "edit", record?: Product) => {
    setModalType(type);
    setIsModalOpen(true);

    if (type === "edit" && record) {
      setSelected(record);
      form.setFieldsValue(record);
    } else {
      setSelected(null);
      form.resetFields();
    }
  };

  //   Delete product handler
  const handleDelete = (product_id: string, product_title: string) => {
    Modal.confirm({
      title: `Are you sure to delete this product name: ${product_title} ?`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          setLoading(true);
          await axios.delete("/api/product", { data: { product_id } });
          message.success(`Product deleted successfully`);
          setCurrentPage(1);
          await fetchProducts();
        } catch (err) {
          console.error(err);
          message.error("Failed to delete product");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Spin size="large" tip="Loading products..." />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: 50 }}>
        <Title level={4} type="danger">
          {error}
        </Title>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <Title level={3}>Product List</Title>

        <Space style={{ justifyContent: "space-between", width: "100%" }}>
          <Search
            placeholder="Search products..."
            value={searchValue}
            onChange={onSearchChange}
            enterButton={<SearchOutlined />}
            style={{ maxWidth: 300 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openModal("create")}
          >
            Create Product
          </Button>
        </Space>

        <Table
          columns={columns}
          dataSource={products.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
          )}
          rowKey="product_id"
          pagination={false}
        />

        <Pagination
          total={products.length}
          pageSize={pageSize}
          current={currentPage}
          onChange={(page) => setCurrentPage(page)}
          style={{ textAlign: "right" }}
        />
      </Space>

      {/* Modal Create / Edit */}
      <Modal
        title={modalType === "create" ? "Create Product" : "Edit Product"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Product Title"
            name="product_title"
            rules={[{ required: true, message: "Please input product title" }]}
          >
            <Input placeholder="Enter product title" />
          </Form.Item>

          <Form.Item
            label="Price"
            name="product_price"
            rules={[
              { required: true, message: "Please input product price" },
              { type: "number", message: "Price must be a number" },
            ]}
          >
            <InputNumber
              placeholder="Enter price"
              style={{ width: "100%" }}
              min={0}
            />
          </Form.Item>

          <Form.Item label="Description" name="product_description">
            <Input.TextArea placeholder="Enter description" rows={3} />
          </Form.Item>

          <Form.Item label="Category" name="product_category">
            <Input placeholder="Enter category" />
          </Form.Item>

          <Form.Item label="Image URL" name="product_image">
            <Input placeholder="Enter image URL" />
          </Form.Item>

          <Form.Item>
            <Space style={{ width: "100%", justifyContent: "end" }}>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type="primary" onClick={handleSubmit} loading={loading}>
                {modalType === "create" ? "Create" : "Update"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
