require('dotenv').config();
const express=require('express');
const mongoose=require('mongoose')
const cors=require("cors");
const path=require("path");
const connectDB=require("./config/db");
const authRoutes=require("./Routes/authRoutes");
const incomeRoutes=require("./Routes/incomeRoutes");
const expenseRoutes=require("./Routes/expenseRoutes");
const dashboardRoutes=require("./Routes/dashboardRoutes");
const app=express();
app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));
app.use(express.json());

connectDB();
app.use("/api/v1/auth",authRoutes)
app.use("/api/v1/income",incomeRoutes)
app.use("/api/v1/expense",expenseRoutes)
app.use("/api/v1/dashboard",dashboardRoutes)
app.use('/uploads', express.static('uploads'));
const PORT=process.env.PORT||3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
