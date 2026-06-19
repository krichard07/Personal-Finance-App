import { useState } from "react";
import axios from "axios";

function AddIncome ({ onIncomeAdded}) {
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");

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

    try {
        console.log({
            category,
            amount
        });

        await axios.post(
            "http://127.0.0.1:8000/api/incomes/",
            {
                category: category,
                amount: amount,
            }
        );

        setAmount("");
        setCategory("");

        if (onIncomeAdded) {
            onIncomeAdded();
        }
    } catch (error) {
        console.log(error.response?.data);
        console.error("Hiba a bevétel mentésekor", error);
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
                className="btn btn-success w-100"
            >
                Hozzáadás
            </button>
        </div>

    </form>
);
}
export default AddIncome;