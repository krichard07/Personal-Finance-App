import ExpenseList from "../components/ExpenseList";

function ExpensesPage({ onExpenseChanged }) {
    return (
        <ExpenseList
            onExpenseChanged={onExpenseChanged}
        />
    );
}

export default ExpensesPage;