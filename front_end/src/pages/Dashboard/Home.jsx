import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/sidebar';
import './Home.css';

import API from '../../utils/api';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

const Home = () => {
  const [summary, setSummary] = useState(null);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    API.get('/dashboard/summary')
      .then(res => setSummary(res.data.data))
      .catch(() => setSummary(null));
    // Optionally fetch user info from API or localStorage
  }, []);

  if (!summary) return <div>Loading...</div>;

  // Chart data
  const chartData = {
    labels: ['Total Balance', 'Total Expenses', 'Total Income'],
    datasets: [
      {
        data: [
          summary.summary.balance,
          summary.summary.totalExpenses,
          summary.summary.totalIncome
        ],
        backgroundColor: ['#7b2cbf', '#ff5e57', '#ffb200'],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="dashboard-layout">
      <Sidebar user={user} onLogout={() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }} />
      <main className="dashboard-main">
        <h2 style={{marginBottom: '1.5rem'}}>Welcome, {user.fullName || user.name || "User"}!</h2>
        <div className="top-cards">
          <div className="card balance">
            <h4>Total Balance</h4>
            <h2>₹{summary.summary.balance.toLocaleString()}</h2>
          </div>
          <div className="card income">
            <h4>Total Income</h4>
            <h2>₹{summary.summary.totalIncome.toLocaleString()}</h2>
          </div>
          <div className="card expenses">
            <h4>Total Expenses</h4>
            <h2>₹{summary.summary.totalExpenses.toLocaleString()}</h2>
          </div>
        </div>
        <div className="dashboard-content">
          <div className="recent-transactions">
            <h4>Recent Transactions</h4>
            <ul>
              {summary.recentTransactions.map(txn => (
                <li key={txn._id} className={txn.type}>
                  <span className="icon">{txn.icon || (txn.type === 'income' ? '💰' : '💸')}</span>
                  <span className="name">{txn.source || txn.title}</span>
                  <span className="date">{new Date(txn.date).toLocaleDateString()}</span>
                  <span className={`amount ${txn.type}`}>
                    {txn.type === 'income' ? '+' : '-'}₹{txn.amount}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="financial-overview">
            <h4>Financial Overview</h4>
            <Doughnut data={chartData} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;