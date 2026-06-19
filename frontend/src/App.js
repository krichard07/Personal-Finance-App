import React, { useState, useEffect } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    NavLink
} from "react-router-dom";

import DashboardPage from "./pages/DashboardPage";
import IncomesPage from "./pages/IncomesPage";
import ExpensesPage from "./pages/ExpensesPage";
import StatisticsPage from "./pages/StatisticsPage";

function App() {

    const [refreshStats, setRefreshStats] = useState(0);

    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "light"
    );

    useEffect(() => {
        document.documentElement.setAttribute(
            "data-bs-theme",
            theme
        );

        localStorage.setItem("theme", theme);
    }, [theme]);

    const triggerStatsRefresh = () => {
        setRefreshStats(prev => prev + 1);
    };


    return (
    <BrowserRouter>

        <div className="container mt-4">

            <nav className="navbar navbar-expand-lg bg-body-tertiary rounded shadow-sm mb-4">

    <div className="container-fluid">

        <span className="navbar-brand fw-bold">
            <i className="bi bi-wallet2 me-2 text-primary"></i>
            Pénzügyi Nyilvántartó
        </span>

        <div className="navbar-nav ms-auto">

            <NavLink
                to="/"
                className={({ isActive }) =>
                    isActive
                        ? "nav-link fw-bold text-primary"
                        : "nav-link"
                }
            >
                Dashboard
            </NavLink>

            <NavLink
                to="/incomes"
                className={({ isActive }) =>
                    isActive
                        ? "nav-link fw-bold text-primary"
                        : "nav-link"
                }
            >
                Bevételek
            </NavLink>

            <NavLink
                to="/expenses"
                className={({ isActive }) =>
                    isActive
                        ? "nav-link fw-bold text-primary"
                        : "nav-link"
                }
            >
                Kiadások
            </NavLink>

            <NavLink
                to="/statistics"
                className={({ isActive }) =>
                    isActive
                        ? "nav-link fw-bold text-primary"
                        : "nav-link"
                }
            >
                Statisztikák
            </NavLink>

            <button
                className="btn btn-link text-body text-decoration-none ms-3"
                onClick={() =>
                    setTheme(theme === "light" ? "dark" : "light")
                }
            >
                <i
                    className={`bi ${
                        theme === "light"
                            ? "bi-moon-stars"
                            : "bi-brightness-high"
                    }`}
                ></i>
            </button>

        </div>

    </div>

</nav>

            <Routes>

                <Route
                    path="/"
                    element={
                        <DashboardPage
                            refresh={refreshStats}
                        />
                    }
                />

                <Route
                    path="/incomes"
                    element={
                        <IncomesPage
                            onIncomeChanged={
                                triggerStatsRefresh
                            }
                        />
                    }
                />

                <Route
                    path="/expenses"
                    element={
                        <ExpensesPage
                            onExpenseChanged={
                                triggerStatsRefresh
                            }
                        />
                    }
                />

                <Route
                    path="/statistics"
                    element={
                        <StatisticsPage />
                    }
                />

            </Routes>

        </div>

    </BrowserRouter>
);
}
export default App;