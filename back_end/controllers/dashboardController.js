const User = require("../models/user");
const Income = require("../models/income");
const Expense = require("../models/expense");

// Get Dashboard Summary (All-Time)
exports.getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all income and expense data for the user (no date filter)
    const incomes = await Income.find({ userId });
    const expenses = await Expense.find({ userId });

    // Calculate totals
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const balance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(2) : 0;

    // Get recent transactions (last 5 incomes and expenses)
    const recentIncomes = await Income.find({ userId })
      .sort({ date: -1 })
      .limit(5);
    const recentExpenses = await Expense.find({ userId })
      .sort({ date: -1 })
      .limit(5);
    const recentTransactions = [
      ...recentIncomes.map(income => ({
        ...income.toObject(),
        type: 'income'
      })),
      ...recentExpenses.map(expense => ({
        ...expense.toObject(),
        type: 'expense'
      }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalIncome,
          totalExpenses,
          balance,
          savingsRate: parseFloat(savingsRate),
          transactionCount: incomes.length + expenses.length
        },
        recentTransactions
      }
    });
  } catch (error) {
    console.error("Dashboard Summary Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard data",
      error: error.message
    });
  }
};

// Get Monthly Analytics
exports.getMonthlyAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const { year, month } = req.query;

    const currentDate = new Date();
    const targetYear = year || currentDate.getFullYear();
    const targetMonth = month || currentDate.getMonth();

    const monthStart = new Date(targetYear, targetMonth, 1);
    const monthEnd = new Date(targetYear, targetMonth + 1, 0);

    // Get monthly data
    const incomes = await Income.find({
      userId,
      date: { $gte: monthStart, $lte: monthEnd }
    });

    const expenses = await Expense.find({
      userId,
      date: { $gte: monthStart, $lte: monthEnd }
    });

    // Daily breakdown
    const dailyData = [];
    const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const dayStart = new Date(targetYear, targetMonth, day);
      const dayEnd = new Date(targetYear, targetMonth, day, 23, 59, 59);

      const dayIncomes = incomes.filter(income => 
        income.date >= dayStart && income.date <= dayEnd
      );
      const dayExpenses = expenses.filter(expense => 
        expense.date >= dayStart && expense.date <= dayEnd
      );

      const dayIncomeTotal = dayIncomes.reduce((sum, income) => sum + income.amount, 0);
      const dayExpenseTotal = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);

      dailyData.push({
        day: day,
        date: dayStart.toISOString().split('T')[0],
        income: dayIncomeTotal,
        expense: dayExpenseTotal,
        balance: dayIncomeTotal - dayExpenseTotal
      });
    }

    // Weekly breakdown
    const weeklyData = [];
    const weeksInMonth = Math.ceil(daysInMonth / 7);

    for (let week = 0; week < weeksInMonth; week++) {
      const weekStart = new Date(targetYear, targetMonth, week * 7 + 1);
      const weekEnd = new Date(targetYear, targetMonth, Math.min((week + 1) * 7, daysInMonth));

      const weekIncomes = incomes.filter(income => 
        income.date >= weekStart && income.date <= weekEnd
      );
      const weekExpenses = expenses.filter(expense => 
        expense.date >= weekStart && expense.date <= weekEnd
      );

      const weekIncomeTotal = weekIncomes.reduce((sum, income) => sum + income.amount, 0);
      const weekExpenseTotal = weekExpenses.reduce((sum, expense) => sum + expense.amount, 0);

      weeklyData.push({
        week: week + 1,
        startDate: weekStart.toISOString().split('T')[0],
        endDate: weekEnd.toISOString().split('T')[0],
        income: weekIncomeTotal,
        expense: weekExpenseTotal,
        balance: weekIncomeTotal - weekExpenseTotal
      });
    }

    res.status(200).json({
      success: true,
      data: {
        month: monthStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        dailyData,
        weeklyData,
        summary: {
          totalIncome: incomes.reduce((sum, income) => sum + income.amount, 0),
          totalExpenses: expenses.reduce((sum, expense) => sum + expense.amount, 0),
          transactionCount: incomes.length + expenses.length
        }
      }
    });

  } catch (error) {
    console.error("Monthly Analytics Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching monthly analytics",
      error: error.message
    });
  }
};

// Get Yearly Summary
exports.getYearlySummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const { year } = req.query;

    const currentDate = new Date();
    const targetYear = year || currentDate.getFullYear();

    const yearStart = new Date(targetYear, 0, 1);
    const yearEnd = new Date(targetYear, 11, 31);

    // Get yearly data
    const incomes = await Income.find({
      userId,
      date: { $gte: yearStart, $lte: yearEnd }
    });

    const expenses = await Expense.find({
      userId,
      date: { $gte: yearStart, $lte: yearEnd }
    });

    // Monthly breakdown
    const monthlyBreakdown = [];
    for (let month = 0; month < 12; month++) {
      const monthStart = new Date(targetYear, month, 1);
      const monthEnd = new Date(targetYear, month + 1, 0);

      const monthIncomes = incomes.filter(income => 
        income.date >= monthStart && income.date <= monthEnd
      );
      const monthExpenses = expenses.filter(expense => 
        expense.date >= monthStart && expense.date <= monthEnd
      );

      const monthIncomeTotal = monthIncomes.reduce((sum, income) => sum + income.amount, 0);
      const monthExpenseTotal = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);

      monthlyBreakdown.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short' }),
        monthNumber: month + 1,
        income: monthIncomeTotal,
        expense: monthExpenseTotal,
        balance: monthIncomeTotal - monthExpenseTotal,
        transactionCount: monthIncomes.length + monthExpenses.length
      });
    }

    // Yearly totals
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const yearlyBalance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((yearlyBalance / totalIncome) * 100).toFixed(2) : 0;

    res.status(200).json({
      success: true,
      data: {
        year: targetYear,
        summary: {
          totalIncome,
          totalExpenses,
          balance: yearlyBalance,
          savingsRate: parseFloat(savingsRate),
          transactionCount: incomes.length + expenses.length
        },
        monthlyBreakdown
      }
    });

  } catch (error) {
    console.error("Yearly Summary Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching yearly summary",
      error: error.message
    });
  }
};
