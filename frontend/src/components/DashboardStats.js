import React, { useEffect, useState } from "react";
import axios from "axios";

function DashboardStats({ refresh }) {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetchStats();
    }, [refresh]);

    const fetchStats = async () => {
        try {
            const response = await axios.get(
                "http://127.0.0.1:8000/api/dashboard/"
            );

            setStats(response.data);
        } catch (error) {
            console.error("Hiba a dashboard lekérésekor:", error);
        }
    };

    if (!stats) {
        return <p>Betöltés...</p>;
    }

return (
    <div className="card shadow-sm border-0 section-card mb-4">
        <div className="card-body">

            <h2 className="text-center mb-4 fw-semibold">
                Áttekintés
            </h2>

            <div className="row gx-4">
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm dashboard-card income-card h-100">
                        <div className="card-body p-3">
                            <div className="position-relative text-center">
                                <div>
                                    <h6 className="text-center dashboard-title mb-2">Összes bevétel</h6>
                                    <h3 className="text-center dashboard-value mb-0">
                                        {Number(stats.total_income).toLocaleString("hu-HU")} Ft
                                    </h3>
                                </div>

                                <i className="bi bi-arrow-up-circle-fill stat-icon text-success position-absolute top-50 end-0 translate-middle-y"></i>
                            </div>
                        </div>
                    </div>
                </div>

            <div className="col-md-4">
                <div className="card border-0 shadow-sm dashboard-card expense-card h-100">
                    <div className="card-body p-3">
                        <div className="position-relative text-center">
                            <div>
                                <h6 className="text-center dashboard-title mb-2">Összes kiadás</h6>
                                <h3 className="text-center dashboard-value mb-0">
                                    {Number(stats.total_expenses).toLocaleString("hu-HU")} Ft
                                </h3>
                            </div>

                            <i className="bi bi-arrow-down-circle-fill stat-icon text-danger position-absolute top-50 end-0 translate-middle-y"></i>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-md-4">
                <div className="card border-0 shadow-sm dashboard-card balance-card h-100">
                    <div className="card-body p-3">
                        <div className="position-relative text-center">
                            <div>
                                <h6 className="text-center dashboard-title mb-2">Egyenleg</h6>
                                <h3 className="text-center dashboard-value mb-0">
                                    {Number(stats.balance).toLocaleString("hu-HU")} Ft
                                </h3>
                            </div>

                            <i className="bi bi-wallet2 stat-icon text-primary position-absolute top-50 end-0 translate-middle-y"></i>
                            
                        </div>
                    </div>
                </div>
            </div>

            </div>

        </div>
    </div>
);
}
export default DashboardStats;