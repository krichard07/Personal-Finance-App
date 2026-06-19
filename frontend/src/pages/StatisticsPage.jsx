import MonthlyIncomeChart from "../components/MonthlyIncomeChart";
import MonthlyExpenseChart from "../components/MonthlyExpenseChart";

function StatisticsPage() {
    return (
        <>
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-body">
                    <h2 className="text-center mb-0">
                        Statisztikák
                    </h2>
                </div>
            </div>

            <div className="row">

                <div className="col-lg-6 mb-4">

                    <div className="card shadow-sm border-0">
                        <div className="card-body">

                            <h4 className="text-center">
                                Havi bevételek
                            </h4>

                            <p className="text-center text-muted">
                                <MonthlyIncomeChart />
                            </p>

                        </div>
                    </div>

                </div>

                <div className="col-lg-6 mb-4">

                    <div className="card shadow-sm border-0">
                        <div className="card-body">

                            <h4 className="text-center">
                                Havi kiadások
                            </h4>

                            <p className="text-center text-muted">
                                <MonthlyExpenseChart />
                            </p>

                        </div>
                    </div>

                </div>

            </div>
        </>
    );
}

export default StatisticsPage;