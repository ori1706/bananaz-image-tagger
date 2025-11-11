# 🍌 Bananaz Image Tagger

A fullstack TypeScript application that allows users to generate random images and create interactive comment pins on them.

## 🚀 Features

- **User Authentication**: Simple stateless authentication with signup and login
- **Image Generation**: Generate random images from Lorem Picsum
- **Interactive Pins**: Click on images to add comment pins at specific coordinates
- **Comment Mode Toggle**: Enable/disable comment creation mode
- **Pin Management**: View, delete your own pins, and see initials of pin creators
- **Draggable Pins**: Drag and drop your own pins to reposition them (Bonus Feature)
- **Image Deletion**: Delete your own images and associated threads (Bonus Feature)
- **Responsive Design**: Beautiful, modern UI that works on all screen sizes

## 🛠️ Tech Stack

### Backend
- **Node.js** with **Express**
- **TypeScript** for type safety
- **ULID** for unique identifiers
- **DOMPurify** for sanitizing user input
- **CORS** enabled for cross-origin requests

### Frontend
- **React 18** with **TypeScript**
- **React Router** for navigation
- **CSS3** for styling with modern gradients and animations
- Fully responsive design

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd bananaz-image-tagger
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start the development server (runs on http://localhost:3001)
npm run dev
```

The backend server will start on `http://localhost:3001`

**Available Backend Scripts:**
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Run production build

### 3. Frontend Setup

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server (runs on http://localhost:3000)
npm start
```

The frontend application will start on `http://localhost:3000` and automatically open in your browser.

**Available Frontend Scripts:**
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## 📖 Usage Guide

### Getting Started

1. **Sign Up**: Navigate to the signup page and create a new account with a username
2. **Login**: If you already have an account, log in with your username
3. **Generate Images**: Click the "Generate New Image" button to create a new random image
4. **Add Comments**: 
   - Enable "Comment Mode" using the toggle switch
   - Click anywhere on the image to place a pin
   - Enter your comment in the dialog that appears
5. **Manage Pins**:
   - Hover over any pin to see the comment details
   - Delete your own pins using the × button in the tooltip
   - Drag and drop your own pins to reposition them
6. **Navigate Images**: Use the sidebar to switch between different images
7. **Delete Images**: Click the 🗑️ icon next to your own images to delete them

### API Endpoints

#### Public Endpoints

- `POST /users` - Create a new user
  - Body: `{"name": "<string>"}`
  
- `POST /login` - Authenticate user
  - Body: `{"name": "<string>"}`

#### Protected Endpoints (require `X-User-Name` header)

- `GET /users` - Get all users
- `POST /images` - Generate new image
- `GET /images` - Get all images
- `POST /images/:id/threads` - Create comment thread
  - Body: `{"x": <number>, "y": <number>, "comment": "<string>"}`
- `GET /images/:id/threads` - Get all threads for an image
- `DELETE /threads/:id` - Delete a thread (creator only)
- `DELETE /images/:id` - Delete an image (creator only)
- `PATCH /threads/:id` - Update thread position (creator only)
  - Body: `{"x": <number>, "y": <number>}`

## 🏗️ Project Structure

```
bananaz-image-tagger/
├── backend/
│   ├── src/
│   │   ├── index.ts          # Main Express application
│   │   ├── types.ts          # TypeScript type definitions
│   │   ├── storage.ts        # In-memory data storage
│   │   ├── middleware.ts     # Authentication middleware
│   │   └── sanitizer.ts      # Input sanitization
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ImageViewer.tsx    # Image display with pins
│   │   │   ├── ImageViewer.css
│   │   │   ├── Pin.tsx            # Interactive pin component
│   │   │   └── Pin.css
│   │   ├── pages/
│   │   │   ├── Login.tsx          # Login page
│   │   │   ├── Signup.tsx         # Signup page
│   │   │   ├── MainApp.tsx        # Main application
│   │   │   ├── MainApp.css
│   │   │   └── Auth.css
│   │   ├── App.tsx               # App router
│   │   ├── AuthContext.tsx       # Authentication context
│   │   ├── api.ts               # API client
│   │   ├── types.ts             # TypeScript types
│   │   ├── index.tsx            # Entry point
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## 🎨 Design Features

- **Modern UI**: Gradient backgrounds, smooth transitions, and hover effects
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile devices
- **Intuitive UX**: Clear visual feedback for all user actions
- **Accessible**: Keyboard navigation and screen reader friendly

## 🔒 Security

- All user input is sanitized on the backend using DOMPurify
- Authentication is stateless with username validation
- Users can only delete their own pins and images
- CORS enabled for secure cross-origin communication

## 🚧 Development Notes

- Backend uses **in-memory storage** (data is lost on server restart)
- Images are fetched from [Lorem Picsum](https://picsum.photos/)
- Pin coordinates are stored as percentages (0-100) for responsive positioning

## 📝 License

This project is created as an assignment and is available for educational purposes.

## 🤝 Contributing

This is an assignment project. Feel free to fork and modify for your own learning purposes.

---

**Enjoy tagging images! 🍌✨**
