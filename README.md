# Drug Interaction Visualizer

A comprehensive web application that helps healthcare professionals and users visualise and understand drug interactions. The application offers interactive visualisations of drug interactions, detailed drug information, and a bookmarking system for saving important interactions.

# Live Demo:- https://drug-interaction-visualizer.vercel.app/

## Tech Stack

### Frontend
- React (v19)
- Vite
- TailwindCSS
- Framer Motion (for animations)
- Three.js & React Three Fiber (for 3D visualizations)
- Recharts (for data visualisation)
- React Router DOM (for routing)
- React Hot Toast (for notifications)

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Passport.js for authentication middleware
- Genkit AI for drug interaction analysis
- Bcrypt for password hashing
- CORS for cross-origin resource sharing

## Installation Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- Git

### Backend Setup
```powershell
# Clone the repository
git clone <repository-url>
cd Drug-Interaction-visualizer/Backend

# Install dependencies
npm install

# Start the server
npm start
```

### Frontend Setup
```powershell
cd ../Frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Environment Variables

### Backend (.env)
```
MONGODB_URI=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret_key
PORT=5000
```

### Frontend (.env)
```
VITE_API_URL=https://drug-interaction-visualizer.vercel.app/
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token

### Drug Information
- `POST /api/drugs/search` - Search for drug information
- `POST /api/drugs/interaction` - Get drug interaction details

### Bookmarks
- `GET /api/bookmarks` - Get the user's bookmarks
- `POST /api/bookmarks` - Save a new bookmark
- `DELETE /api/bookmarks/:id` - Delete a bookmark

## Features

1. **Drug Interaction Analysis**
   - Search for multiple drugs
   - Visual representation of interactions
   - Risk level classification (High, Moderate, Low)
   - Detailed interaction descriptions

2. **Drug Information**
   - Comprehensive drug details
   - Usage instructions
   - Side effects
   - Precautions

3. **User Management**
   - Secure authentication
   - Personal bookmark system
   - Protected routes

4. **Visualization**
   - Interactive charts
   - PDF export functionality
   - Mobile-responsive design

5. **Bookmark System**
   - Save important drug interactions
   - Organise and manage saved interactions
   - Quick access to frequently checked interactions

## Contributing Guidelines

1. Fork the repository
2. Create a new branch for your feature (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature')
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - please take a look at the LICENSE file for details.

## Installation Troubleshooting

### Common Issues

1. **MongoDB Connection Issues**
   - Ensure MongoDB is running locally
   - Check your connection string in the .env file
   - Verify network connectivity

2. **Node.js Version Conflicts**
   - Use nvm to manage Node.js versions
   - Ensure you're using a compatible version

3. **Port Conflicts**
   - Check if ports 5000 (backend) and 5173 (frontend) are available
   - Modify ports in the configuration if needed
