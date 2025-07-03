const User=require("../models/user")
const Income = require("../models/income");
const XLSX = require('xlsx');

// Add Income Source
exports.addIncome = async (req, res) => {
  const userId = req.user.id;

  try {
    const { icon, source, amount, date } = req.body;

    // Validation
    if (!source || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate date
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format. Please use YYYY-MM-DD format" });
    }

    const newIncome = new Income({
      userId,
      icon,
      source,
      amount,
      date: parsedDate
    });

    await newIncome.save();
    res.status(200).json(newIncome);
  } catch (error) {
    console.error("Add Income Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get All Income Source
exports.getAllIncome = async (req, res) => {
  try {
    const incomes = await Income.find({ userId: req.user.id });
    res.status(200).json(incomes);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete Income
exports.deleteIncome = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);
    if (!income) return res.status(404).json({ message: "Income not found" });

    // Check if user owns this income
    if (income.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    await income.deleteOne();
    res.status(200).json({ message: "Income removed" });
  } catch (error) {
    console.error("Delete Income Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Download Income Excel
exports.downloadIncomeExcel = async (req, res) => {
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

    // Get income data
    const incomes = await Income.find(filter).sort({ date: -1 });

    if (incomes.length === 0) {
      return res.status(404).json({ 
        message: "No income data found for the specified period" 
      });
    }

    // Prepare data for Excel
    const excelData = incomes.map((income, index) => ({
      'S.No': index + 1,
      'Source': income.source,
      'Amount': income.amount,
      'Date': income.date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      'Icon': income.icon || '💰',
      'Created At': income.createdAt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }));

    // Calculate totals
    const totalAmount = incomes.reduce((sum, income) => sum + income.amount, 0);
    const totalRecords = incomes.length;

    // Add summary row
    excelData.push({
      'S.No': '',
      'Source': 'TOTAL',
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
      { wch: 20 },  // Source
      { wch: 15 },  // Amount
      { wch: 15 },  // Date
      { wch: 8 },   // Icon
      { wch: 20 }   // Created At
    ];
    worksheet['!cols'] = columnWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Income Report');

    // Generate filename with current date
    const currentDate = new Date().toISOString().split('T')[0];
    const filename = `income_report_${currentDate}.xlsx`;

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Write to buffer and send
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    res.send(buffer);

  } catch (error) {
    console.error("Download Income Excel Error:", error);
    res.status(500).json({ 
      message: "Error generating Excel file",
      error: error.message 
    });
  }
};
