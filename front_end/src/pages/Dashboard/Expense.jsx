import React, { useEffect, useState } from "react";
import API from "../../utils/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import EmojiPicker from "emoji-picker-react";

const Expense = () => {
  const [expenses, setExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ icon: "💸", title: "", amount: "", date: "" });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const fetchExpenses = async () => {
    const res = await API.get("/expense/get");
    setExpenses(res.data);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const chartData = expenses.map((exp) => ({
    date: new Date(exp.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
    amount: exp.amount,
  }));

  const handleAdd = async (e) => {
    e.preventDefault();
    await API.post("/expense/add", form);
    setShowModal(false);
    setForm({ icon: "💸", title: "", amount: "", date: "" });
    fetchExpenses();
  };

  const handleDownload = async () => {
    const res = await API.get("/expense/downloadexcel", { responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "expense_report.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h3>Expense Overview</h3>
          <p>Track your spending over time and analyze your expense trends.</p>
        </div>
        <button
          style={{
            background: "#ff5e57",
            color: "#fff",
            border: "none",
            padding: "10px 16px",
            borderRadius: 6,
            fontWeight: 500,
            cursor: "pointer",
          }}
          onClick={() => setShowModal(true)}
        >
          + Add Expense
        </button>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, padding: 24, margin: "1.5rem 0" }}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#ff5e57" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h4>Expense Sources</h4>
          <button
            style={{
              background: "#ff5e57",
              color: "#fff",
              padding: "8px 12px",
              borderRadius: 6,
              border: "none",
              cursor: "pointer",
            }}
            onClick={handleDownload}
          >
            Download
          </button>
        </div>
        <div>
          {expenses.map((exp) => (
            <div
              key={exp._id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 0",
                borderBottom: "1px solid #eee",
              }}
            >
              <span style={{ fontSize: 20 }}>{exp.icon || "💸"}</span>
              <span>{exp.title}</span>
              <span>{new Date(exp.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
              <span style={{ color: "#ff5e57", fontWeight: "bold" }}>- ₹{exp.amount}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: "2rem",
              width: "90%",
              maxWidth: 500,
              position: "relative",
            }}
          >
            <h3>Add Expense</h3>
            <form onSubmit={handleAdd}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16, position: "relative" }}>
                <span style={{ fontSize: 24, marginRight: 8 }}>{form.icon}</span>
                <span
                  style={{ fontWeight: 500, color: "#ff5e57", cursor: "pointer" }}
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  Pick Icon
                </span>
                {showEmojiPicker && (
                  <div style={{ position: "absolute", top: "40px", zIndex: 999 }}>
                    <EmojiPicker
                      onEmojiClick={(e) => {
                        setForm({ ...form, icon: e.emoji });
                        setShowEmojiPicker(false);
                      }}
                    />
                  </div>
                )}
              </div>

              <input
                type="text"
                placeholder="Expense Title"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: 12,
                  borderRadius: 6,
                  border: "1px solid #ccc",
                }}
              />

              <input
                type="number"
                min="1"
                placeholder="Amount"
                value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: 12,
                  borderRadius: 6,
                  border: "1px solid #ccc",
                }}
              />

              <input
                type="date"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: 12,
                  borderRadius: 6,
                  border: "1px solid #ccc",
                }}
              />

              <button
                type="submit"
                style={{
                  width: "100%",
                  background: "#ff5e57",
                  color: "#fff",
                  padding: "12px",
                  border: "none",
                  borderRadius: 6,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Add Expense
              </button>
            </form>
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: "absolute",
                top: 12,
                right: 16,
                background: "none",
                border: "none",
                fontSize: 24,
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expense;
