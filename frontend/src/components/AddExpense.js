import React, { useState } from "react";
import { addExpense } from "../api"; 

const AddExpense = ({ onAdd }) => {
    const [category, setCategory] = useState("");
    const [amount, setAmount] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!category.trim() || !amount) {
            alert("Minden mezőt ki kell tölteni!");
            return;
        }

        if (Number(amount) <= 0) {
            alert("Az összegnek nagyobbnak kell lennie 0-nál!");
            return;
        }

        const newExpense = {
            category,
            amount
        };

        try {
            await onAdd(newExpense);

            setCategory("");
            setAmount("");
        } catch (error) {
            console.error("Hiba új kiadás hozzáadásakor:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="row g-2 mb-3">

        <div className="col-md-5">
            <input
            type="text"
            className="form-control"
            placeholder="Kategória"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            />
        </div>

        <div className="col-md-4">
            <input
            type="number"
            className="form-control"
            placeholder="Összeg"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            />
        </div>

        <div className="col-md-3">
            <button
            type="submit"
            className="btn btn-danger w-100"
            >
            Hozzáadás
            </button>
        </div>

        </form>
    );
};

export default AddExpense;
