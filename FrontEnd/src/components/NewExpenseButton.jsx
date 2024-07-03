import { useEffect, useState, useRef } from "react";
import plusIcon from "../assets/plus-symbol-button.png";
import "./NewExpenseButton.css";
import { setIsAddEditPopupOpen } from "../store/toolsSlice.js";
import { useDispatch } from "react-redux";
import { setExpense } from "../store/expenseSlice.js";

function NewExpenseButton() {
    const breakpoint = 576;
    const dispatch = useDispatch();
    const buttonText = useRef(null);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    window.addEventListener("resize", () => {
        setScreenWidth(window.innerWidth);
    });

    useEffect(() => {
        if (screenWidth >= breakpoint) {
            buttonText.current.textContent = "New Expense";
        } else {
            buttonText.current.textContent = "New";
        }
    }, [screenWidth]);

    const handleClick = () => {
        dispatch(setExpense({ expense: null }));
        dispatch(setIsAddEditPopupOpen({ isAddEditPopupOpen: true }));
    };

    return (
        <button className="add-invoice-btn" onClick={handleClick}>
            <div className="circle flex justify-center items-center">
                <img src={plusIcon} alt="plus-icon" />
            </div>
            <h2 ref={buttonText}>New</h2>
        </button>
    );
}

export default NewExpenseButton;
