import React, { useEffect, useState } from "react";
import API from "../../utils/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import EmojiPicker from "emoji-picker-react";

const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ icon: "💰", source: "", amount: "", date: "" });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const fetchIncomes = async () => {
    const res = await API.get("/income/get");
    setIncomes(res.data);
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  const chartData = incomes.map((inc) => ({
    date: new Date(inc.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
    amount: inc.amount,
  }));

  const handleAdd = async (e) => {
    e.preventDefault();
    await API.post("/income/add", form);
    setShowModal(false);
    setForm({ icon: "💰", source: "", amount: "", date: "" });
    fetchIncomes();
  };

  const handleDownload = async () => {
    const res = await API.get("/income/downloadexcel", { responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "income_report.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h3>Income Overview</h3>
          <p>Track your earnings over time and analyze your income trends.</p>
        </div>
        <button
          style={{
            background: "#7b2cbf",
            color: "#fff",
            border: "none",
            padding: "10px 16px",
            borderRadius: 6,
            fontWeight: 500,
            cursor: "pointer",
          }}
          onClick={() => setShowModal(true)}
        >
          + Add Income
        </button>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, padding: 24, margin: "1.5rem 0" }}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#7b2cbf" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h4>Income Sources</h4>
          <button
            style={{
              background: "#7b2cbf",
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
          {incomes.map((inc) => (
            <div
              key={inc._id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 0",
                borderBottom: "1px solid #eee",
              }}
            >
              <span style={{ fontSize: 20 }}>{inc.icon || "💰"}</span>
              <span>{inc.source}</span>
              <span>{new Date(inc.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
              <span className="amount">+ ₹{inc.amount}</span>
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
            <h3>Add Income</h3>
            <form onSubmit={handleAdd}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16, position: "relative" }}>
                <span style={{ fontSize: 24, marginRight: 8 }}>{form.icon}</span>
                <span
                  style={{ fontWeight: 500, color: "#7b2cbf", cursor: "pointer" }}
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
                placeholder="Freelance, Salary, etc"
                value={form.source}
                onChange={e => setForm({ ...form, source: e.target.value })}
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
                  background: "#7b2cbf",
                  color: "#fff",
                  padding: "12px",
                  border: "none",
                  borderRadius: 6,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Add Income
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

export default Income;
