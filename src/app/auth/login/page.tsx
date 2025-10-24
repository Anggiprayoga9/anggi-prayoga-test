"use client";

import { Button, Form, Input, message } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAuth } from "firebase/auth";

export default function LoginPage() {
  const { login, user, getToken } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) router.push("/products");
  }, [user, router]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      const auth = getAuth();
      const currentUser = auth.currentUser;
      const token = currentUser ? await currentUser.getIdToken(true) : null;

      if (!token) throw new Error("Gagal mendapatkan token Firebase");

      localStorage.setItem("firebaseToken", token);

      message.success("Login berhasil!");
      router.push("/products");
    } catch (err) {
      message.error("Login gagal!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#f0f2f5",
      }}
    >
      <Form
        name="login"
        onFinish={onFinish}
        style={{
          width: 360,
          padding: 24,
          borderRadius: 8,
          background: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Please input your Email!" }]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input type="password" placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Log in
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
