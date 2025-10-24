# Anggi Prayoga Test - Product Management Application

## Repository Information
**Repository Name**: anggi-prayoga-test  
**GitHub Link**: https://github.com/Anggiprayoga9/anggi-prayoga-test

## Table of Contents
1. [Setup & Installation](#setup--installation)
2. [Product Management Features](#product-management-features)

---

## Setup & Installation

### Prerequisites
1. **Node.js** (v14 or later)
2. **npm** (v6 or later)
3. **Next.js 14** with App Router
4. **TypeScript** for type safety (recommended)
5. **Ant Design (antd)** for UI components
6. **Axios** for HTTP client (required for API calls)
7. **Firebase** (for authentication)

### Installation Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/Anggiprayoga9/anggi-prayoga-test.git
2. cd anggi-prayoga-test
3. npm install
4. configuration file for firebase:
      import { initializeApp } from "firebase/app";
      import { getAuth } from "firebase/auth";
      
      const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_AUTH_DOMAIN",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_STORAGE_BUCKET",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID",
      };
      
      const app = initializeApp(firebaseConfig);
      const auth = getAuth(app);
      
      export { auth };
7. npm run dev
Visit http://localhost:3000 in your browser.

## Feature Web
1. Create Product
2. Read Product
3. Update Product
4. Delete Product
