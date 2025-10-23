import axios from "axios";
import { NextResponse } from "next/server";

const BASE_URL = "http://localhost:8001/api/web/v1";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search")?.toLowerCase();

        const res = await axios.get(`${BASE_URL}/products`, {
            params: search ? { search } : {},
        });

        let data = res.data?.data || [];

        if (search) {
            data = data.filter(
                (item: any) =>
                    item.product_title.toLowerCase().includes(search) ||
                    (item.product_description?.toLowerCase().includes(search)) ||
                    (item.product_category?.toLowerCase().includes(search))
            );
        }

        return NextResponse.json({ ...res.data, data });
    } catch (error) {
        console.error("API Proxy Error:", error);
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}
