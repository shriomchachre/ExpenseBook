import "./ExpenseStatus.css";

function ExpenseStatus({ isPaid }) {
    return (
        <div
            className={`expense-status flex justify-center items-center ${
                isPaid ? "paid" : "pending"
            }`}
        >
            <ul>
                <li>{isPaid ? "Paid" : "Pending"}</li>
            </ul>
        </div>
    );
}

export default ExpenseStatus;
