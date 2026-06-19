import DashboardStats from "../components/DashboardStats";
import IncomeChart from "../components/IncomeChart";
import ExpenseChart from "../components/ExpenseChart";

function DashboardPage({ refresh }) {
    return (
        <>
            <DashboardStats refresh={refresh} />

            <div className="row mt-4">

                <div className="col-lg-6 mb-4">
                    <IncomeChart refresh={refresh} />
                </div>

                <div className="col-lg-6 mb-4">
                    <ExpenseChart refresh={refresh} />
                </div>

            </div>
        </>
    );
}

export default DashboardPage;