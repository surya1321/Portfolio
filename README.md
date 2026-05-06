# Portfolio — Meruva Surya Tej

A personal portfolio website showcasing projects, skills, and experience. Built with a modern tech stack featuring a React frontend and a Python FastAPI backend, all deployed as a single monorepo on Vercel.

## 🏗 Architecture

This project is structured as a monorepo containing both the frontend and backend services:

- **`/frontend`**: The user interface built with React, Tailwind CSS, and Framer Motion.
- **`/backend`**: A fast, asynchronous REST API built with Python, FastAPI, and MongoDB.

## 🚀 Tech Stack

### Frontend
- **Framework**: React 19 (via Create React App / Craco)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **UI Components**: Radix UI, Lucide React icons
- **Data Fetching**: Axios

### Backend
- **Framework**: FastAPI
- **Database**: MongoDB (via Motor async driver)
- **Server**: Uvicorn

## 🛠 Local Development

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- MongoDB Atlas account (or local MongoDB instance)

### 1. Backend Setup
Navigate to the backend directory and set up your Python environment:

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt
```

Create a `.env` file in the `backend` directory with your MongoDB credentials:
```env
MONGO_URL="your_mongodb_connection_string"
DB_NAME="portfolio_db"
```

Start the FastAPI server:
```bash
python server.py
```
*The API will be available at `http://localhost:8000`.*

### 2. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies:

```bash
cd frontend
npm install
```

Start the React development server:
```bash
npm start
```
*The frontend will be available at `http://localhost:3000`.*

## ☁️ Deployment (Vercel)

This project is configured for seamless monorepo deployment on **Vercel** using the `vercel.json` configuration file.

### Vercel Routing
- **Frontend**: Served at the root path `/`
- **Backend API**: Served at the path `/_/backend`

### Environment Variables
When deploying to Vercel, ensure you add the following environment variables to your project settings:
- `MONGO_URL`
- `DB_NAME`

## 📝 License
This project is open-source and available under the MIT License.
