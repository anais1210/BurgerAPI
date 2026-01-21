# 🍔 BurgerAPI

**BurgerAPI** is a full-stack web application for managing a restaurant menu.  
It includes a **backend API** to manage products and meals, and a **frontend** built with React + Vite for viewing and managing the menu.  

The frontend is deployable on **GitHub Pages**, while the backend can connect to a database and run on platforms like **Render** or **Railway**.

---

## 🚀 Features

### Frontend
- Display menu categories: Burgers, Snacks, Drinks, Desserts
- Add, edit, and delete products and meals
- Category counters for quick overview
- Fully responsive design

### Backend
- REST API to manage products and meals
- Full CRUD operations: Create, Read, Update, Delete
- Database integration (MongoDB)

### Deployment
- Frontend deployable via **GitHub Pages**
- This is the **backend microservice** for the BurgerAPI project.  
- Backend is written in **Node.js + TypeScript** and is designed to be deployed on **Render** (https://burgerapi-54rf.onrender.com/).

---

## 📁 Project Structure

BurgerAPI/
├─ backend/ # Node.js + TypeScript API
├─ frontend/ # React + Vite frontend
├─ public/ # Static assets (images, icons)
├─ index.html # Vite entry point
├─ package.json
└─ README.md

---
## 🚀 Features

- REST API for CRUD operations on:
  - **Products**: Burgers, Snacks, Drinks, Desserts
  - **Meals**: Combinations of products
  - **Orders**: Made by customer by selecting in the Menu
  - **Menu**: Combination of Products and Meals
  - **Restaurant**: CRUD operation and update Orders
- Type-safe API using **TypeScript**
- Connects to a database (MongoDB)
- Ready for production deployment
  
---

## ⚙️ Installation

1. Clone the project:

```bash
git clone https://github.com/anais1210/BurgerAPI.git
cd BurgerAPI
npm install
npm run dev
```

