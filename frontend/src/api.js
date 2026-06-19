import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/expenses/";

export const getExpenses = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const addExpense = async (expense) => {
    const response = await axios.post(API_URL, expense);
    return response.data;
};

// 🛑 ÚJ: Törlés funkció (DELETE)
export const deleteExpense = async (id) => {
    await axios.delete(`${API_URL}${id}/`);
};

// 🛑 ÚJ: Szerkesztési (UPDATE) API-hívás
export const updateExpense = async (id, updatedExpense) => {
    const response = await axios.put(`${API_URL}${id}/`, updatedExpense);
    return response.data;
};

export const getDashboardStats = async () => {
    const response = await fetch(
        "http://127.0.0.1:8000/api/dashboard/"
    );

    return await response.json();
};