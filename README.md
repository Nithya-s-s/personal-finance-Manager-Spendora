# 💰 Spendora - Personal Finance Tracker

A modern, full-stack web application for tracking personal income and expenses with beautiful visualizations and intuitive user interface.

![Spendora Dashboard](https://img.shields.io/badge/Status-Active-brightgreen)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)

## 🚀 Features

### ✨ Core Functionality
- **User Authentication**: Secure login/signup with JWT tokens
- **Income Tracking**: Add, edit, and categorize income sources
- **Expense Management**: Track and categorize expenses
- **Dashboard Analytics**: Visual charts and insights
- **Profile Management**: User profile with avatar upload
- **Data Export**: Export financial data to Excel format

### 🎨 User Interface
- **Modern Design**: Clean, responsive UI built with React
- **Interactive Charts**: Beautiful data visualizations using Chart.js and Recharts
- **Real-time Updates**: Instant feedback with toast notifications
- **Mobile Responsive**: Works seamlessly on all devices
- **Dark/Light Theme**: Customizable appearance

### 🔒 Security Features
- **Password Encryption**: Bcrypt hashing for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Middleware for route protection
- **Input Validation**: Server-side validation for all inputs

## 🛠️ Tech Stack

### Frontend
- **React 19.1.0** - Modern UI library
- **Vite** - Fast build tool and dev server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **Chart.js & Recharts** - Data visualization
- **React Icons** - Icon library
- **React Hot Toast** - Toast notifications
- **Moment.js** - Date manipulation
- **Emoji Picker React** - Emoji selection

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - JSON Web Tokens
- **Bcryptjs** - Password hashing
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing
- **XLSX** - Excel file generation

## 📁 Project Structure

```
Spendora/
├── front_end/                 # React frontend application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/            # Page components
│   │   │   ├── Auth/         # Authentication pages
│   │   │   └── Dashboard/    # Dashboard pages
│   │   ├── utils/            # Utility functions and API
│   │   └── assets/           # Static assets
│   ├── public/               # Public assets
│   └── package.json          # Frontend dependencies
├── back_end/                 # Node.js backend application
│   ├── config/               # Database configuration
│   ├── controllers/          # Route controllers
│   ├── middleware/           # Custom middleware
│   ├── models/               # MongoDB schemas
│   ├── Routes/               # API routes
│   ├── uploads/              # File upload directory
│   └── package.json          # Backend dependencies
└── README.md                 # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/spendora.git
   cd spendora
   ```

2. **Install backend dependencies**
   ```bash
   cd back_end
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../front_end
   npm install
   ```

4. **Environment Setup**

   Create a `.env` file in the `back_end` directory:
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLIENT_URL=http://localhost:5173
   ```

5. **Start the development servers**

   **Backend (Terminal 1):**
   ```bash
   cd back_end
   npm start
   ```

   **Frontend (Terminal 2):**
   ```bash
   cd front_end
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## 📊 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/user` - Get user info
- `PUT /api/v1/auth/profile` - Update profile

### Income Management
- `GET /api/v1/income` - Get all income records
- `POST /api/v1/income` - Add new income
- `PUT /api/v1/income/:id` - Update income
- `DELETE /api/v1/income/:id` - Delete income

### Expense Management
- `GET /api/v1/expense` - Get all expense records
- `POST /api/v1/expense` - Add new expense
- `PUT /api/v1/expense/:id` - Update expense
- `DELETE /api/v1/expense/:id` - Delete expense

### Dashboard Analytics
- `GET /api/v1/dashboard/summary` - Get financial summary
- `GET /api/v1/dashboard/charts` - Get chart data
- `GET /api/v1/dashboard/export` - Export data to Excel

## 🎯 Key Features Explained

### 📈 Dashboard Analytics
The dashboard provides comprehensive financial insights including:
- Monthly income vs expense comparison
- Category-wise spending breakdown
- Trend analysis with interactive charts
- Quick summary cards

### 💳 Expense Tracking
- Add expenses with categories and descriptions
- Upload receipts and supporting documents
- Set budget limits and track spending
- Export expense reports

### 💰 Income Management
- Track multiple income sources
- Categorize income types
- Monitor income trends
- Generate income reports

### 🔐 Security
- JWT-based authentication
- Password encryption with bcrypt
- Protected API endpoints
- Secure file uploads

## 🚀 Deployment

### Backend Deployment (Heroku)
1. Create a Heroku account
2. Install Heroku CLI
3. Initialize git repository
4. Create Heroku app
5. Set environment variables
6. Deploy with `git push heroku main`

### Frontend Deployment (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your preferred platform
3. Set environment variables for API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## 🙏 Acknowledgments

- React team for the amazing framework
- Chart.js for beautiful visualizations
- MongoDB for the robust database
- All contributors and supporters

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Contact: your.email@example.com
- Join our Discord community

---

⭐ **Star this repository if you found it helpful!** 
