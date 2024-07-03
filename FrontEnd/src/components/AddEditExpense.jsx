import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input, Button } from "./index.js";
import { useSelector, useDispatch } from "react-redux";
import { setIsAddEditPopupOpen, setReload } from "../store/toolsSlice.js";
import { setExpense } from "../store/expenseSlice.js";
import ConfigService from "../services/config.js";

function AddEditExpense() {
    const breakpoint = 768;
    const configService = new ConfigService();
    const dispatch = useDispatch();
    const isAddEditPopupOpen = useSelector(
        (state) => state.toolsReducer.isAddEditPopupOpen
    );
    const expense = useSelector((state) => state.expenseReducer.expense);
    const reload = useSelector((state) => state.toolsReducer.reload);
    const { register, handleSubmit, setValue } = useForm();
    const [error, setError] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    window.addEventListener("resize", () => {
        setScreenWidth(window.innerWidth);
    });

    useEffect(() => {
        if (expense !== null) {
            setFieldsValue({
                clientEmail: expense.client.email,
                dueDate: expense.dueDate,
                description: expense.description,
                amount: expense.amount,
                status: expense.status,
            });
        } else {
            setFieldsValue({
                clientEmail: "",
                dueDate: "",
                description: "",
                amount: "",
                status: false,
            });
        }
    }, [expense]);

    const handleFormSubmit = async (data, e) => {
        setError("");
        setIsDisabled(true);
        try {
            let response;
            if (expense === null) {
                response = await configService.addExpense(data);
            } else {
                const newData = { id: expense._id, ...data };
                response = await configService.updateExpense(newData);
            }
            if (!response.success) {
                setError(response.message);
            } else {
                e.target.reset();
                dispatch(setReload({ reload: !reload }));
                dispatch(setIsAddEditPopupOpen({ isAddEditPopupOpen: false }));
                dispatch(setExpense({ expense: null }));
            }
            setIsDisabled(false);
        } catch (error) {
            setError(error.message);
        }
    };

    const setFieldsValue = ({
        clientEmail,
        dueDate,
        description,
        amount,
        status,
    }) => {
        setValue("clientEmail", clientEmail);
        setValue("dueDate", dueDate);
        setValue("description", description);
        setValue("amount", amount);
        setValue("status", status);
    };

    const deleteExpense = async (e) => {
        e.preventDefault();
        setError("");
        setIsDisabled(true);
        try {
            const response = await configService.deleteExpense({
                id: expense._id,
            });

            if (!response.success) {
                setError(response.message);
            } else {
                dispatch(setReload({ reload: !reload }));
                dispatch(setIsAddEditPopupOpen({ isAddEditPopupOpen: false }));
                dispatch(setExpense({ expense: null }));
                setFieldsValue({
                    clientEmail: "",
                    dueDate: "",
                    description: "",
                    amount: "",
                    status: false,
                });
            }
            setIsDisabled(false);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div
                className={`bg-[#141625] absolute top-0 ${
                    isAddEditPopupOpen ? "left-0" : "left-[-100%]"
                } w-full  p-4 text-white md:w-[30%] z-[1000] transition-[300ms] h-[100svh] ${
                    screenWidth >= breakpoint && "scrollbar"
                } overflow-auto`}
                style={{
                    boxShadow: `rgba(0, 0, 0, 0.1) 0px 4px 6px -1px,
        rgba(0, 0, 0, 0.06) 0px 2px 4px -1px`,
                }}
            >
                <div className="w-full">
                    <p
                        className="text-sm font-medium hover:cursor-pointer"
                        onClick={(e) => {
                            e.preventDefault();
                            dispatch(
                                setIsAddEditPopupOpen({
                                    isAddEditPopupOpen: false,
                                })
                            );
                            dispatch(setExpense({ expense: null }));
                        }}
                    >
                        <button className="mr-3" style={{ color: "#7c5df9" }}>
                            {"<"}
                        </button>{" "}
                        Go Back
                    </p>
                </div>
                <h1 className="my-6 font-normal text-lg">
                    {expense !== null
                        ? `Edit #${expense._id.substring(14)}`
                        : "New Expense"}
                </h1>
                <p className="text-sm my-4" style={{ color: "#7c5df9" }}>
                    Bill To
                </p>
                <div className="mb-6">
                    <Input
                        label="Client's Email"
                        type="email"
                        placeholder="xyz@gmail.com"
                        className="w-full text-white bg-[#1f213a] px-2 text-sm rounded-[0.1875rem] h-[2.5rem]"
                        disabled={expense !== null && true}
                        {...register("clientEmail", { required: true })}
                    />
                </div>
                <div className="mb-6">
                    <Input
                        label="Due Date"
                        type="text"
                        placeholder="DD/MM/YYYY"
                        className="w-full text-white bg-[#1f213a] px-2 text-sm rounded-[0.1875rem] h-[2.5rem]"
                        {...register("dueDate", { required: true })}
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="description" className="text-sm">
                        Description
                    </label>
                    <textarea
                        id="description"
                        className="outline-none mt-1 w-full text-white bg-[#1f213a] p-2 text-sm rounded-[0.1875rem] resize-none h-[5rem]"
                        {...register("description")}
                    ></textarea>
                </div>
                <div className="mb-6">
                    <Input
                        label="Amount"
                        type="text"
                        className="w-full text-white bg-[#1f213a] px-2 text-sm rounded-[0.1875rem] h-[2.5rem]"
                        {...register("amount", { required: true })}
                    />
                </div>
                {expense !== null && (
                    <Input
                        label="Paid"
                        type="checkbox"
                        className="m-2"
                        {...register("status")}
                    />
                )}
                {error && (
                    <p className="text-xs mb-2" style={{ color: "#c00" }}>
                        {error}
                    </p>
                )}
                <div className="mb-6 flex justify-end">
                    {expense !== null ? (
                        <Button
                            className="text-sm h-[2.5rem] rounded-full w-24 mx-2 bg-red-700 disabled:opacity-75 disabled:cursor-not-allowed"
                            onClick={deleteExpense}
                            disabled={isDisabled}
                        >
                            Delete
                        </Button>
                    ) : (
                        <Button
                            className="text-sm bg-[#252946] h-[2.5rem] rounded-full w-24 mx-2"
                            onClick={(e) => {
                                e.preventDefault();
                                dispatch(
                                    setIsAddEditPopupOpen({
                                        isAddEditPopupOpen: false,
                                    })
                                );
                                dispatch(setExpense({ expense: null }));
                            }}
                        >
                            Cancel
                        </Button>
                    )}
                    <Button
                        className="text-sm bg-[#7c5df9] h-[2.5rem] rounded-full w-24 disabled:opacity-75 disabled:cursor-not-allowed"
                        type="submit"
                        disabled={isDisabled}
                    >
                        Save
                    </Button>
                </div>
            </div>
        </form>
    );
}

export default AddEditExpense;
