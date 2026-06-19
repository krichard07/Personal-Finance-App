import React, { useState, useEffect } from "react";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
);

function MonthlyIncomeChart() {

    const [chartData, setChartData] = useState([]);

    useEffect(() => {

        const fetchData = async () => {

            try {

                const response = await fetch(
                    "http://127.0.0.1:8000/api/incomes/monthly/"
                );

                const data = await response.json();

                setChartData(data);

            } catch (error) {

                console.error(
                    "Havi bevétel diagram hiba:",
                    error
                );

            }

        };

        fetchData();

    }, []);

    const textColor = getComputedStyle(
        document.documentElement
    ).getPropertyValue("--bs-body-color");

    const data = {
        labels: chartData.map(item =>
            new Date(item.month)
                .toLocaleDateString(
                    "hu-HU",
                    {
                        year: "numeric",
                        month: "short"
                    }
                )
        ),

        datasets: [
            {
                label: "Bevétel",

                data: chartData.map(
                    item => item.total
                ),

                borderColor: "#198754",

                backgroundColor: "#198754",

                tension: 0.25,

                pointRadius: 5,

                borderWidth: 3
            }
        ]
    };

    const options = {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        },

        scales: {

            x: {
                ticks: {
                    color: textColor
                }
            },

            y: {
                ticks: {
                    color: textColor
                }
            }

        }

    };

    if (chartData.length === 0) {
    return (
        <div className="text-center py-5 text-muted">
            Nincs még kiadási adat.
        </div>
    );
}

    return (

        <div
            style={{
                width: "100%",
                height: "300px"
            }}
        >

            <Line
                data={data}
                options={options}
            />

        </div>

    );

}

export default MonthlyIncomeChart;