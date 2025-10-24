"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "./context/AuthContext";

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/products");
    } else {
      router.push("/auth/login");
    }
  }, [user, router]);
  return <div>Loading...</div>;
}
