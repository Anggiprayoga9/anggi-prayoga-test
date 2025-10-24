import axios from "axios";
import { NextResponse } from "next/server";

const BASE_URL = "http://localhost:8001/api/web/v1";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search")?.toLowerCase();
        const token = request.headers.get("authorization")?.replace("Bearer ", "") || "";
        console.log("Received token:", token);

        if (!token) {
            return NextResponse.json({ error: "Authorization token is missing" }, { status: 401 });
        }
   
        const res = await axios.get(`${BASE_URL}/products`, {
            params: search ? { search } : {},
            headers: { Authorization: `Bearer ${token}` },
        });

        let data = Array.isArray(res.data?.data) ? res.data.data : [];

        if (search) {
            data = data.filter(
                (item: any) =>
                    item.product_title.toLowerCase().includes(search) ||
                    (item.product_description?.toLowerCase().includes(search)) ||
                    (item.product_category?.toLowerCase().includes(search))
            );
        }
        return NextResponse.json({ ...res.data, data });
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || "Unknown error";
        console.error("API Proxy Error:", errorMessage);
        // Return detailed error message for debugging (for development environment)
        return NextResponse.json({ error: `Failed to fetch products: ${errorMessage}`, details: error.stack }, { status: 500 });
    }
}
