import React, { useState, useEffect } from "react";

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement
} from "chart.js";

import { Pie, Bar, Line } from "react-chartjs-2";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement
);



// 🔥 Szín generátor (HSL formátum, így mindig egyedi színt ad)
// 🔥 Egyetlen kategória mindig ugyanazt a színt kapja
const colorCache = {}; // 💾 Tároljuk a generált színeket

const getCategoryColor = (category) => {
    if (colorCache[category]) {
        return colorCache[category]; // Ha már van, akkor visszaadjuk ugyanazt
    }
    const randomColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`; // 🎨 Élénk random szín
    colorCache[category] = randomColor;
    return randomColor;
};

{/*const CategoryChart = ({ expenses }) => {*/}
{/*const CategoryChart = () => {*/}
const CategoryChart = ({ refresh }) => {

    const [chartType, setChartType] = useState(
    localStorage.getItem("chartType") || "pie"
);

    const [categoryColors, setCategoryColors] = useState({}); // 🎨 Színek tárolása
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
    const fetchChartData = async () => {
        try {
            const response = await fetch(
                "http://127.0.0.1:8000/api/incomes/chart/"
            );

            const data = await response.json();

            setChartData(data);
        } catch (error) {
            console.error("Chart hiba:", error);
        }
    };

    fetchChartData();
}, [refresh]);

    useEffect(() => {
        setCategoryColors(prevColors => {
            const newColors = { ...prevColors }; // 🔥 Megőrizzük a meglévő színeket

            {/*expenses.forEach(expense => {*/}
            chartData.forEach(expense => {
                if (!newColors[expense.category]) {
                    newColors[expense.category] = getCategoryColor(expense.category); // 🔥 Csak az új kategóriák kapnak új színt
                }
            });

            return newColors; // 🔥 Csak akkor állítja be, ha új kategória van
        });
        }, [chartData]);
    const categoryTotals = chartData.reduce((acc, expense) => {
    acc[expense.category] = expense.total;
    return acc;
}, {});

const borderColor = getComputedStyle(
    document.documentElement
).getPropertyValue("--bs-border-color");

const textColor = getComputedStyle(
    document.documentElement
).getPropertyValue("--bs-body-color");

    const chartDataset = {
    labels: Object.keys(categoryTotals),
    datasets: [
        {
            label: "Bevételek",

            data: Object.values(categoryTotals),

            backgroundColor: Object.keys(categoryTotals).map(
                category => categoryColors[category]
            ),

            borderColor: textColor,

            pointBackgroundColor: Object.keys(categoryTotals).map(
                category => categoryColors[category]
            ),

            borderWidth: 2,
            pointRadius: 5,
            tension: 0.15,
        },
    ],
};

useEffect(() => {
    localStorage.setItem("chartType", chartType);
}, [chartType]);

const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
        legend: {
            position: "bottom",
            labels: {
                boxWidth: 12,
                padding: 10
            }
        }
    }
};

    return (
    <div className="card shadow-sm border-0 h-100">
        <div className="card-body">
            <h3 className="card-title text-center mb-3">
                Bevételek kategóriánként
            </h3>

             <div className="text-center mb-3">

                <button
                    className={`btn ${
                        chartType === "pie"
                            ? "btn-primary"
                            : "btn-outline-primary"
                    } me-2`}
                    onClick={() => setChartType("pie")}
                >
                    <i className="bi bi-pie-chart-fill me-2"></i>
                    Kör
                </button>

                <button
                    className={`btn ${
                        chartType === "bar"
                            ? "btn-primary"
                            : "btn-outline-primary"
                    } me-2`}
                    onClick={() => setChartType("bar")}
                >
                    <i className="bi bi-bar-chart-fill me-2"></i>
                    Oszlop
                </button>

                <button
                    className={`btn ${
                        chartType === "line"
                            ? "btn-primary"
                            : "btn-outline-primary"
                    }`}
                    onClick={() => setChartType("line")}
                >
                    <i className="bi bi-graph-up me-2"></i>
                    Vonal
                </button>

            </div>

            <div className="h-100">
                <div
                    style={{
                        width: "100%",
                        height: "320px",
                    }}
                >
                    {chartType === "pie" && (
                        <Pie
                            data={chartDataset}
                            options={options}
                        />
                    )}

                    {chartType === "bar" && (
                        <Bar
                            data={chartDataset}
                            options={options}
                        />
                    )}

                    {chartType === "line" && (
                        <Line
                            data={chartDataset}
                            options={options}
                        />
                    )}
                </div>
            </div>
        </div>
    </div>
);
};

export default CategoryChart;