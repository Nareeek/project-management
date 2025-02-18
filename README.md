# 📌 Project Management System

A **full-stack web application** for managing users, projects, and tasks efficiently. Built with **Laravel** and **React**, this system enables **seamless project tracking, user management, and real-time notifications**.

## 🚀 Key Features
✅ **Project & Task Management**  
✅ **User Authentication & Role Management**  
✅ **CRUD Operations for Users, Projects, and Tasks**  
✅ **Real-time Notifications & Toast Messages**  
✅ **RESTful API with Laravel Backend**  

---

## 🛠️ Technologies Used

### **Frontend:**
- ⚛️ **React (Vite)**
- 🎨 **Tailwind CSS + Bootstrap**
- 🔄 **React Router for Navigation**
- 📡 **Axios for API Requests**
- 🌐 **State Management with React Hooks**

### **Backend:**
- 🖥️ **Laravel (PHP 8+)**
- 🛢 **MySQL Database**
- 🔐 **Laravel Breeze for Authentication**
- 🔄 **Eloquent ORM & API Resource Controllers**

---

## 📌 Project Structure

```
/project-management
│── backend/ (Laravel API)
│── frontend/ (React App)
│── README.md
│── .gitignore
│── package.json
│── composer.json
```

---

## 💻 Local Development Setup  

### 1️⃣ **Prerequisites**  
Ensure you have the following installed:  
- [Node.js (LTS version)](https://nodejs.org/)  
- [Composer](https://getcomposer.org/)  
- PHP (>= 8.0)  
- MySQL  

### 2️⃣ **Clone the Repository**  
```sh
git clone https://github.com/your-username/project-management.git
cd project-management
```

### 3️⃣ **Backend Setup (Laravel API)**  
#### **Install Dependencies**  
```sh
cd backend
composer install
```

#### **Set Up Environment File**  
```sh
cp .env.example .env
```
Edit the `.env` file and set up your **database credentials**:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=project_management
DB_USERNAME=root
DB_PASSWORD=
```

#### **Generate Application Key & Migrate Database**  
```sh
php artisan key:generate
php artisan migrate --seed
```

#### **Run Laravel Server**  
```sh
php artisan serve
```
Your **Laravel API** will be available at **`http://127.0.0.1:8000`**.

---

### 4️⃣ **Frontend Setup (React Application)**  
```sh
cd ../frontend
npm install
```


#### Install React with TypeScript

If you haven't already installed React with TypeScript, follow these steps:
```sh
cd frontend
npm create vite@latest
```

Select:

Framework: React

Variant: TypeScript


Then continue with:
```sh
npm install
npm run dev
```

#### **Run Development Server**  
```sh
npm run dev
```
Your **React frontend** will be available at **`http://localhost:5173`**.

---

## 🔄 API Endpoints  

### **User API**
| Method | Endpoint     | Description        |
|--------|------------|--------------------|
| GET    | `/users`   | Get all users      |
| POST   | `/users`   | Create a new user  |
| PUT    | `/users/{id}` | Update a user    |
| DELETE | `/users/{id}` | Delete a user    |

### **Project API**
| Method | Endpoint     | Description        |
|--------|------------|--------------------|
| GET    | `/projects`   | Get all projects  |
| POST   | `/projects`   | Create a project  |
| PUT    | `/projects/{id}` | Update a project |
| DELETE | `/projects/{id}` | Delete a project |

### **Task API**
| Method | Endpoint     | Description        |
|--------|------------|--------------------|
| GET    | `/tasks`   | Get all tasks      |
| POST   | `/tasks`   | Create a task      |
| PUT    | `/tasks/{id}` | Update a task    |
| DELETE | `/tasks/{id}` | Delete a task    |

---

## ✅ Best Practices Followed  

✔ **Modular Code Structure**: Backend & frontend are separated for better maintainability.  
✔ **State Management**: Using React hooks for better performance.  
✔ **Form Validations**: Backend and frontend validation for better data integrity.  

---

## 🛠 Common Issues & Fixes  

### 1️⃣ **Database Connection Error**
**Fix:** Ensure MySQL is running and `.env` file has the correct credentials.

### 2️⃣ **Frontend Not Loading**
**Fix:** Ensure the frontend dependencies are installed correctly:
```sh
cd frontend
npm install
npm run dev
```

### 3️⃣ **CORS Issues When Making API Calls**
**Fix:** Install Laravel CORS package:
```sh
composer require fruitcake/laravel-cors
```
Then publish the config:
```sh
php artisan vendor:publish --tag="cors"
```
And update `config/cors.php`:
```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
```

---

## 📜 License  
This project is licensed under the **MIT License**.  
