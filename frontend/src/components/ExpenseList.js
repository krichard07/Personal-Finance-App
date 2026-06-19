import React, { useEffect, useState } from "react";
import { getExpenses, deleteExpense, updateExpense, addExpense, getDashboardStats } from "../api";
import CategoryChart from "./ExpenseChart";
import AddExpense from "./AddExpense";
{/*import "./ExpenseList.css"; // ✅ CSS importálása*/}

const ExpenseList = ({ onExpenseChanged }) => {
    const [stats, setStats] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [editingExpense, setEditingExpense] = useState(null);
    const [editCategory, setEditCategory] = useState("");
    const [editAmount, setEditAmount] = useState("");

    // 📌 ÚJ: Dátumszűrés, rendezés és lapozás
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [sortOrder, setSortOrder] = useState("desc"); // Legújabb elöl
    const [nextPage, setNextPage] = useState(null);
    const [prevPage, setPrevPage] = useState(null);
    {/*const [currentPageUrl, setCurrentPageUrl] = useState("http://127.0.0.1:8000/api/expenses/");*/}

    const [chartsRefresh, setChartRefresh] = useState(0);

    const fetchExpenses = async (url = null) => {
    try {
        let apiUrl;

        if (url) {
            apiUrl = url;
        } else {
            apiUrl = `http://127.0.0.1:8000/api/expenses/?ordering=${
                sortOrder === "desc" ? "-id" : "id"
            }`;

            if (startDate) {
                apiUrl += `&start_date=${startDate}`;
            }

            if (endDate) {
                apiUrl += `&end_date=${endDate}`;
            }
        }

        const response = await fetch(apiUrl);
        const data = await response.json();

        setExpenses(data.results);
        setNextPage(data.next);
        setPrevPage(data.previous);

    } catch (error) {
        console.error("Hiba az API lekérdezése közben:", error);
        setExpenses([]);
    }
};

    const fetchStats = async () => {
        try {
            const data = await getDashboardStats();
            setStats(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchExpenses();
        fetchStats();
    }, [startDate, endDate, sortOrder]);

    const handleNextPage = () => {
        if (nextPage) fetchExpenses(nextPage);
    };

    const handlePrevPage = () => {
        if (prevPage) fetchExpenses(prevPage);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Biztosan törölni szeretnéd?")) {
            await deleteExpense(id);

            fetchExpenses();
            fetchStats();

            if (onExpenseChanged) {
                onExpenseChanged();
            }

            setChartRefresh(prev => prev + 1);
        }
    };

    const handleAddExpense = async (newExpense) => {
        try {
            await addExpense(newExpense);

            fetchExpenses();
            fetchStats();

            if (onExpenseChanged) {
                onExpenseChanged();
            }

            setChartRefresh(prev => prev + 1);
        } catch (error) {
            console.error("Hiba új kiadás hozzáadásakor:", error);
        }
    };

    const handleEditStart = (expense) => {
        setEditingExpense(expense.id);
        setEditCategory(expense.category);
        setEditAmount(expense.amount);
    };

    const handleEditSave = async () => {
        try {
            if (editingExpense) {
                await updateExpense(editingExpense, {
                    category: editCategory,
                    amount: editAmount
                });

                await fetchExpenses();
                await fetchStats();

                if (onExpenseChanged) {
                    onExpenseChanged();
                }

                setChartRefresh(prev => prev + 1);

                setEditingExpense(null);
            }
        } catch (error) {
            console.error("Hiba a kiadás módosításakor:", error);
        }
    };

    {/*const handleEditSave = async () => {
        if (editingExpense) {
            await updateExpense(editingExpense, { category: editCategory, amount: editAmount });
            fetchExpenses();
            setEditingExpense(null);
        }
    };*/}

    return (
        <div className="row gx-4">
            <div className="col-lg-8">
                <div className="card shadow-sm border-0">
                    <div className="card-body">
                        <h3 className="text-center fw-bold mb-4">Kiadások</h3>

                        {/*  <AddExpense onAdd={fetchExpenses} /> */}
                        <AddExpense onAdd={handleAddExpense} />

                        <div className="row mb-3 align-items-end">

                            <div className="col-md-4">
                                <label className="form-label">Kezdő dátum</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>

                            <div className="col-md-4">
                                <label className="form-label">Záró dátum</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>

                            <div className="col-md-1">
                                <label className="form-label">&nbsp;</label>
                                <button
                                    className="btn btn-outline-secondary w-100"
                                    onClick={() => {
                                        setStartDate("");
                                        setEndDate("");
                                    }}
                                    title="Szűrés törlése"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="col-md-3">
                                <label className="form-label">Rendezés</label>
                                <select
                                    className="form-select"
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value)}
                                >
                                    <option value="desc">Legújabb elöl</option>
                                    <option value="asc">Legrégebbi elöl</option>
                                </select>
                            </div>
                        </div>

                           <div className="card border-danger mb-4">
                                <div className="card-body bg-danger-subtle">
                                    <h5 className="text-center card-title">Összes kiadás</h5>

                                    <h3 className="text-center text-danger mb-0">
                                        {stats
                                            ? Number(stats.total_expenses).toLocaleString("hu-HU")
                                            : "0"} Ft
                                    </h3>
                                </div>
                            </div>

                        {/* 📌 Kiadások lista */}
                        <table className="table table-striped table-hover align-middle expense-table">
                            <thead className="table-dark">
                                <tr>
                                    <th>Kategória</th>
                                    <th>Dátum</th>
                                    <th className="text-end">Összeg (HUF)</th>
                                    <th className="text-center" style={{ width: "120px" }}>Műveletek</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expenses.map(expense => (
                                    <tr key={expense.id}>
                                        <td>
                                            {editingExpense === expense.id ? (
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    value={editCategory}
                                                    onChange={(e) => setEditCategory(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            console.log("Enter Pressed")
                                                            handleEditSave();
                                                        }
                                                    }}
                                                />
                                            ) : (
                                                expense.category
                                            )}
                                        </td>
                                        <td>{expense.date || "N/A"}</td>
                                        <td style={{ textAlign: "right" }}>
                                            {editingExpense === expense.id ? (
                                                <input
                                                    type="number"
                                                    value={editAmount}
                                                    onChange={(e) => setEditAmount(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            handleEditSave();      // vagy ami nálad a mentő függvény neve
                                                        }
                                                    }}
                                                />
                                            ) : (
                                                `${Number(expense.amount).toLocaleString("hu-HU")} Ft`
                                            )}
                                        </td>
                                        <td className="text-center">
                                            {editingExpense === expense.id ? (
                                                <>
                                                    <button
                                                        className="btn btn-outline-success btn-sm me-2"
                                                        onClick={handleEditSave}
                                                    >
                                                        <i className="bi bi-check-circle-fill"></i>
                                                    </button>

                                                    <button
                                                        className="btn btn-outline-secondary btn-sm"
                                                        onClick={() => setEditingExpense(null)}
                                                    >
                                                        <i className="bi bi-x-circle-fill"></i>
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        className="btn btn-outline-primary btn-sm me-2"
                                                        onClick={() => handleEditStart(expense)}
                                                    >
                                                        <i className="bi bi-pencil-square"></i>
                                                    </button>

                                                    <button
                                                        className="btn btn-outline-danger btn-sm"
                                                        onClick={() => handleDelete(expense.id)}
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                                        </tbody>
                        </table>

                        {/* 📌 Lapozás gombok */}
                        <div className="d-flex justify-content-center gap-2 mt-4">
                            <button
                                className="btn btn-outline-secondary"
                                onClick={handlePrevPage}
                                disabled={!prevPage}
                            >
                                <i className="bi bi-chevron-left me-1"></i>
                                Előző
                            </button>

                            <button
                                className="btn btn-outline-primary"
                                onClick={handleNextPage}
                                disabled={!nextPage}
                            >
                                Következő
                                <i className="bi bi-chevron-right ms-1"></i>
                            </button>
                        </div>

                    </div> {/* card-body */}
                </div> {/* card */}
            </div> {/* col-lg-8 */}

            {/* 📌 Jobb oldalon: Kördiagram */}
            <div className="col-lg-4">
                <CategoryChart refresh={chartsRefresh} />
                {/*<CategoryChart />*/}
                {/*<CategoryChart expenses={expenses} />*/}
            </div>
        </div>
    );
};

export default ExpenseList;
