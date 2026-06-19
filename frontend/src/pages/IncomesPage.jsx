import IncomeList from "../components/IncomeList";

function IncomesPage({ onIncomeChanged }) {
    return (
        <IncomeList
            onIncomeChanged={onIncomeChanged}
        />
    );
}

export default IncomesPage;