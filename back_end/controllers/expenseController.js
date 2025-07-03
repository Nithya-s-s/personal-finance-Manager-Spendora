const User = require("../models/user");
const Expense = require("../models/expense");
const XLSX = require('xlsx');

// Add Expense
exports.addExpense = async (req, res) => {
  const userId = req.user.id;

  try {
    const { icon, title, amount, date } = req.body;

    // Validation
    if (!title || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate date
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format. Please use YYYY-MM-DD format" });
    }

    const newExpense = new Expense({
      userId,
      icon,
      title,
      amount,
      date: parsedDate
    });

    await newExpense.save();
    res.status(200).json(newExpense);
  } catch (error) {
    console.error("Add Expense Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get All Expenses
exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete Expense
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    // Check if user owns this expense
    if (expense.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    await expense.deleteOne();
    res.status(200).json({ message: "Expense removed" });
  } catch (error) {
    console.error("Delete Expense Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Download Expense Excel
exports.downloadExpenseExcel = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;

    // Build filter object
    const filter = { userId };
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    // Get expense data
    const expenses = await Expense.find(filter).sort({ date: -1 });

    if (expenses.length === 0) {
      return res.status(404).json({ 
        message: "No expense data found for the specified period" 
      });
    }

    // Prepare data for Excel
    const excelData = expenses.map((expense, index) => ({
      'S.No': index + 1,
      'Title': expense.title,
      'Amount': expense.amount,
      'Date': expense.date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      'Icon': expense.icon || '💸',
      'Created At': expense.createdAt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }));

    // Calculate totals
    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalRecords = expenses.length;

    // Add summary row
    excelData.push({
      'S.No': '',
      'Title': 'TOTAL',
      'Amount': totalAmount,
      'Date': '',
      'Icon': '',
      'Created At': `Total Records: ${totalRecords}`
    });

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    const columnWidths = [
      { wch: 8 },   // S.No
      { wch: 20 },  // Title
      { wch: 15 },  // Amount
      { wch: 15 },  // Date
      { wch: 8 },   // Icon
      { wch: 20 }   // Created At
    ];
    worksheet['!cols'] = columnWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Expense Report');

    // Generate filename with current date
    const currentDate = new Date().toISOString().split('T')[0];
    const filename = `expense_report_${currentDate}.xlsx`;

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Write to buffer and send
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    res.send(buffer);

  } catch (error) {
    console.error("Download Expense Excel Error:", error);
    res.status(500).json({ 
      message: "Error generating Excel file",
      error: error.message 
    });
  }
}; 