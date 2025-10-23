import axios from "axios";
import { NextResponse } from "next/server";

const BASE_URL = "http://localhost:8001/api/web/v1";

// Get product by id
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("product_id");

    if (!id) {
        return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    try {
        const response = await axios.get(`${BASE_URL}/product`, {
            params: { id },
        });
        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error("Error fetching product:", error.message);
        return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
    }
}

// Create Product
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const response = await axios.post(`${BASE_URL}/product`, body);
        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error("Error creating product:", error.message);
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
    }
}

// Update Product
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const response = await axios.put(`${BASE_URL}/product`, body);
        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error("Error updating product:", error.message);
        return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
    }
}

// Delete Product
export async function DELETE(request: Request) {
    try {
        const body = await request.json();
        const { product_id } = body;

        if (!product_id) {
            return NextResponse.json({ error: "Missing id" }, { status: 400 });
        }

        const response = await axios.delete(`${BASE_URL}/product`, {
            data: { product_id }, // kirim ke backend lewat data
        });

        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error("Error deleting product:", error.message);
        return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
    }
}


