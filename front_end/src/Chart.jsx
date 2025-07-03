// src/Chart.jsx
import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

// Sample data ─ tweak to your real figures or pull from an API
const data = [
  { name: 'Jan', income: 5600, expense: 3400 },
  { name: 'Feb', income: 7200, expense: 4500 },
  { name: 'Mar', income: 9100, expense: 6000 },
  { name: 'Apr', income: 6500, expense: 5500 },
  { name: 'May', income: 2100, expense: 1500 },
  { name: 'Jun', income: 7800, expense: 5000 },
  { name: 'Jul', income: 9500, expense: 6300 },
];

const Chart = () => (
  <ResponsiveContainer width="100%" height={260}>
    <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip
        contentStyle={{ borderRadius: 10 }}
        labelStyle={{ fontWeight: 600 }}
      />
      {/* Expense first so it sits underneath Income in the stack */}
      <Bar dataKey="expense" stackId="a" fill="#a45dd1" radius={[4, 4, 0, 0]} />
      <Bar dataKey="income"  stackId="a" fill="#7b2cbf" radius={[4, 4, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
);

export default Chart;
