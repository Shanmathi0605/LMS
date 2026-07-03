# EduLearn LMS

A Full Stack Learning Management System built with the MERN stack (MongoDB, Express, React, Node.js).

## Features
- **Role-Based Access Control:** Students, Teachers, and Admins.
- **Course Management:** Create, update, delete, and browse courses.
- **Video Hosting:** Integration with Cloudinary for seamless video streaming.
- **Quizzes & Certificates:** Interactive quizzes and dynamic PDF certificate generation.
- **Modern UI:** Built with React, Tailwind CSS, and Context API.

## Project Structure
- `/backend`: Node.js, Express, MongoDB (API Server)
- `/frontend`: React, Vite, Tailwind CSS (Client Application)

## Prerequisites
- Node.js installed on your local machine.
- MongoDB Atlas cluster (or local instance).
- Cloudinary account for media storage.

## Environment Variables
Create a `.env` file in the `/backend` directory and add the following:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Running Locally

1. **Install Dependencies:**
   - Backend: `cd backend && npm install`
   - Frontend: `cd frontend && npm install`

2. **Start Development Servers:**
   - Backend: `cd backend && npm run dev` (Runs on http://localhost:5000)
   - Frontend: `cd frontend && npm run dev` (Runs on http://localhost:5173)

## Deployment Guide

### Backend (Render)
1. Push your code to GitHub.
2. Go to Render.com and create a new **Web Service**.
3. Connect your GitHub repository and select the `backend` root directory (if using monorepo structure, set root dir to `backend`).
4. Set Build Command: `npm install`
5. Set Start Command: `npm start`
6. Add all the environment variables from your `.env` file to the Render dashboard.

### Frontend (Vercel)
1. Go to Vercel.com and select **Add New Project**.
2. Import your GitHub repository.
3. Set the Root Directory to `frontend`.
4. The build command (`npm run build`) and output directory (`dist`) will be automatically detected by Vercel for Vite.
5. Deploy!
