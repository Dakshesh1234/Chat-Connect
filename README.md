# Chat Connect

Chat Connect is a real-time chat application built with the MERN stack. It allows users to communicate with each other instantly, with features like one-on-one messaging, online status indicators, and more.

## Features

* **Real-time Messaging:** Instant messaging with Socket.io.
* **User Authentication:** Secure user signup and login.
* **Online Status:** See which users are currently online.
* **Image Sharing:** Share images in your chats.
* **Video Calls:** Real-time video calls with WebRTC.
* **Customizable Themes:** Personalize the look and feel of the application.
* **End-to-End Encryption:** Messages are encrypted for privacy.

## Tech Stack

### Frontend

* **React:** A JavaScript library for building user interfaces.
* **Zustand:** A small, fast, and scalable state-management solution.
* **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
* **DaisyUI:** A component library for Tailwind CSS.
* **Socket.IO Client:** For real-time communication.
* **Axios:** A promise-based HTTP client for the browser and Node.js.
* **React Router DOM:** For declarative routing in React.

### Backend

* **Node.js:** A JavaScript runtime built on Chrome's V8 JavaScript engine.
* **Express:** A fast, unopinionated, minimalist web framework for Node.js.
* **MongoDB:** A NoSQL database for storing application data.
* **Mongoose:** An elegant MongoDB object modeling for Node.js.
* **Socket.IO:** Enables real-time, bidirectional and event-based communication.
* **JWT:** For secure user authentication.
* **Bcryptjs:** For hashing passwords.
* **Cloudinary:** For image hosting.

## Getting Started

### Prerequisites

* Node.js (v14 or later)
* MongoDB
* Cloudinary account

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/dakshesh1234/chat-connect.git](https://github.com/dakshesh1234/chat-connect.git)
    cd chat-connect
    ```

2.  **Install backend dependencies:**
    ```bash
    cd backend
    npm install
    ```

3.  **Install frontend dependencies:**
    ```bash
    cd ../frontend
    npm install
    ```

### Environment Variables
Create a `.env` file in the `backend` directory and add the following variables:
```env
PORT=5001
MONGODB_URI=<your_mongodb_uri>
JWT_SECRET=<your_jwt_secret>
CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
CLOUDINARY_API_KEY=<your_cloudinary_api_key>
CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
ENCRYPTION_KEY=<your_32_byte_encryption_key_in_hex>
```

### Running the Application

1.  **Start the backend server:**
    ```bash
    cd backend
    npm run dev
    ```

2.  **Start the frontend development server:**
    ```bash
    cd ../frontend
    npm run dev
    ```

The application will be available at `http://localhost:5173`.

## Available Scripts

### Root Directory

* `npm run build`: Builds both the frontend and backend for production.
* `npm start`: Starts the backend server.

### Frontend

* `npm run dev`: Starts the development server.
* `npm run build`: Builds the app for production.
* `npm run lint`: Lints the source code.
* `npm run preview`: Previews the production build.

### Backend

* `npm run dev`: Starts the development server with Nodemon.
* `npm start`: Starts the production server.
