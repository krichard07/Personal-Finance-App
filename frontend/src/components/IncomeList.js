import React, { useEffect, useState } from "react";
import axios from "axios";

import AddIncome from "./AddIncome";
import IncomeChart from "./IncomeChart";

function IncomeList({ onIncomeChanged }) {
  const [incomes, setIncomes] = useState([]);
  const [stats, setStats] = useState(null);

    const [editingIncome, setEditingIncome] = useState(null);
    const [editAmount, setEditAmount] = useState("");
    const [editCategory, setEditCategory] = useState("");
    const [editDate, setEditDate] = useState("");

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [sortOrder, setSortOrder] = useState("desc");
    const [nextPage, setNextPage] = useState(null);
    const [prevPage, setPrevPage] = useState(null);

    const fetchStats = async () => {
    try {
        const response = await axios.get(
            "http://127.0.0.1:8000/api/dashboard/"
        );

        setStats(response.data);
    } catch (error) {
        console.error(
            "Hiba a dashboard adatok lekérésekor:",
            error
        );
    }
};

    useEffect(() => {
        fetchStats();
    }, []);

    useEffect(() => {
        fetchIncomes();
    }, [sortOrder, startDate, endDate]);

const fetchIncomes = async (url = null) => {
    try {

        let apiUrl = url;

        if (!apiUrl) {
            apiUrl =
                `http://127.0.0.1:8000/api/incomes/?ordering=${sortOrder === "desc" ? "-id" : "id"}`;

            if (startDate) {
                apiUrl += `&start_date=${startDate}`;
            }

            if (endDate) {
                apiUrl += `&end_date=${endDate}`;
            }
        }

        console.log(apiUrl);

        const response = await axios.get(apiUrl);

        setIncomes(response.data.results);
        setNextPage(response.data.next);
        setPrevPage(response.data.previous);

    } catch (error) {
        console.error("Hiba a bevételek lekérésekor:", error);
    }
};

const deleteIncome = async (id) => {
    if (!window.confirm("Biztosan törlöd ezt a bevételt?")) {
        return;
    }

    try {
        await axios.delete(
            `http://127.0.0.1:8000/api/incomes/${id}/`
        );

        fetchIncomes();
        fetchStats();

        if (onIncomeChanged) {
            onIncomeChanged();
}
    } catch (error) {
        console.error("Hiba törléskor:", error);
    }
};

const startEdit = (income) => {
    setEditingIncome(income.id);
    setEditAmount(income.amount);
    setEditCategory(income.category);
    setEditDate(income.date);
};

const saveEdit = async (id) => {
    console.log("Mentés indul");

    try {
        await axios.put(
            `http://127.0.0.1:8000/api/incomes/${id}/`,
            {
                category: editCategory,
                amount: editAmount,
                date: editDate
            }
        );

        console.log("Mentés sikeres");

        setEditingIncome(null);
        setEditAmount("");
        setEditCategory("");

        fetchIncomes();
        fetchStats();

        if (onIncomeChanged) {
            onIncomeChanged();
}
    } catch (error) {
    console.log("BACKEND HIBA:", error.response?.data);
    console.error("Hiba módosításkor:", error);
}
};

const handleNextPage = () => {
    if (nextPage) {
        fetchIncomes(nextPage);
    }
};

const handlePrevPage = () => {
    if (prevPage) {
        fetchIncomes(prevPage);
    }
};

return (
    <div className="row gx-4">

        <div className="col-lg-8">

            <div className="card shadow-sm border-0">

                <div className="card-body">

                    <h3 className="text-center fw-bold mb-4">Bevételek</h3>

                    <AddIncome
                        onIncomeAdded={() => {
                        fetchIncomes();
                        fetchStats();

                        if (onIncomeChanged) {
                            onIncomeChanged();
                        }
                    }}
                    />
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

                    <div className="card border-success mb-4">
                        <div className="card-body bg-success-subtle">
                            <h5 className="text-center card-title">Összes bevétel</h5>

                            <h3 className="text-center text-success mb-0">
                                {stats
                                    ? Number(stats.total_income).toLocaleString("hu-HU")
                                    : "0"} Ft
                            </h3>
                        </div>
                    </div>

                    <table className="table table-striped table-hover align-middle expense-table">

                        <thead className="table-dark">
                            <tr>
                                <th>Kategória</th>
                                <th>Dátum</th>
                                <th className="text-end">
                                    Összeg (HUF)
                                </th>
                                <th
                                    className="text-center"
                                    style={{ width: "120px" }}
                                >
                                    Műveletek
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                        {incomes.map((income) => (
                            <tr key={income.id}>
                                <td>
                                    {editingIncome === income.id ? (
                                        <input
                                        className="form-control"
                                        type="text"
                                        value={editCategory}
                                        onChange={(e) => setEditCategory(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                saveEdit(income.id);
                                            }
                                        }}
                                    />
                                    ) : (
                                        income.category
                                    )}
                                </td>

                                <td>
                                    {new Date(income.date).toLocaleDateString("hu-HU")}
                                </td>
                                <td className="text-end">
                                    {editingIncome === income.id ? (
                                        <input
                                            type="number"
                                            value={editAmount}
                                            onChange={(e) => setEditAmount(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    saveEdit(income.id);   // IncomeList-ben
                                                }
                                            }}
                                        />
                                    ) : (
                                        `${Number(income.amount).toLocaleString("hu-HU")} Ft`
                                    )}
                                </td>

                                <td className="text-center">
                                    {editingIncome === income.id ? (
                                        <button
                                            className="btn btn-outline-success btn-sm me-2"
                                            onClick={() => saveEdit(income.id)}
                                        >
                                            <i className="bi bi-check-circle-fill"></i>
                                        </button>
                                    ) : (
                                        <button
                                            className="btn btn-outline-primary btn-sm me-2"
                                            onClick={() => startEdit(income)}
                                        >
                                            <i className="bi bi-pencil-square"></i>
                                        </button>
                                    )}

                                    <button
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => deleteIncome(income.id)}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                </table>

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
                </div>
            </div>
        </div>

        <div className="col-lg-4">
            <IncomeChart />
        </div>
    </div>
  );
}

export default IncomeList;