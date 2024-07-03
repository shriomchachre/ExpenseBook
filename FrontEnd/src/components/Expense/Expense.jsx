import { ExpenseStatus } from "../index.js";
import arrowRight from "../../assets/arrow-right.png";
import "./Expense.css";
import { useState } from "react";

function Expense({ id, name, dueDate, amount, status, actionOnClick }) {
    const breakpoint = 576;
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    window.addEventListener("resize", () => {
        setScreenWidth(window.innerWidth);
    });

    return (
        <div className="expense-container" onClick={actionOnClick}>
            {screenWidth >= breakpoint ? (
                <>
                    <div className="flex justify-between items-center">
                        <h2>{id}</h2>
                        <p>Due {dueDate}</p>
                        <p>{name}</p>
                        <h2>₹ {amount}</h2>
                        <div className="flex items-center">
                            <ExpenseStatus isPaid={status} />
                            <img src={arrowRight} alt="arrow-right" />
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="row-1 flex justify-between items-center">
                        <h2>{id}</h2>
                        <p>{name}</p>
                    </div>
                    <div className="row-2 flex justify-between items-center">
                        <div className="due-date-and-amount-container">
                            <p
                                style={{
                                    marginBottom: "0.5rem",
                                    marginTop: "0.75rem",
                                }}
                            >
                                Due {dueDate}
                            </p>
                            <h2>₹ {amount}</h2>
                        </div>
                        <ExpenseStatus isPaid={status} />
                    </div>
                </>
            )}
        </div>
    );
}

export default Expense;
