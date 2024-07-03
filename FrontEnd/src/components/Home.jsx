import { useEffect, useState } from "react";
import {
    Nav,
    ToolsPanel,
    Expense,
    Loader,
    DropdownMenu,
    AddEditExpense,
} from "./index.js";
import "./Home.css";
import ConfigService from "../services/config.js";
import AuthService from "../services/auth.js";
import { useSelector, useDispatch } from "react-redux";
import { setExpense } from "../store/expenseSlice.js";
import { setIsAddEditPopupOpen } from "../store/toolsSlice.js";
import { logout as sliceLogout } from "../store/authSlice.js";
import { useNavigate } from "react-router-dom";
import conf from "../conf/conf.js";
import Cookies from "js-cookie";

function Home() {
    const breakpoint = 768;
    const configService = new ConfigService();
    const authService = new AuthService();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const search = useSelector((state) => state.toolsReducer.search);
    const filterBy = useSelector((state) => state.toolsReducer.filterBy);
    const sortBy = useSelector((state) => state.toolsReducer.sortBy);
    const currentUser = useSelector((state) => state.authReducer.currentUser);
    const isAddEditPopupOpen = useSelector(
        (state) => state.toolsReducer.isAddEditPopupOpen
    );
    const reload = useSelector((state) => state.toolsReducer.reload);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [expenses, setExpenses] = useState([]);
    const [avatar, setAvatar] = useState("");
    const [isPageDropdownOpen, setIsPageDropdownOpen] = useState(false);
    const [pageSize, setPageSize] = useState(20);
    const [buttons, setButtons] = useState([]);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    window.addEventListener("resize", () => {
        setScreenWidth(window.innerWidth);
    });

    const logout = () => {
        dispatch(sliceLogout());
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        navigate(conf.loginRoute);
    };

    useEffect(() => {
        setLoading(true);

        if (currentUser !== null) {
            setAvatar(currentUser.avatar);
        } else {
            authService.getCurrentUser().then((response) => {
                if (response.success) {
                    setAvatar(response?.data.user.avatar);
                } else {
                    if (response.statusCode === 401) {
                        logout();
                    }
                }
            });
        }
    }, []);

    useEffect(() => {
        setLoading(true);

        configService.getCount({ search, filterBy }).then((response) => {
            if (response.success) {
                setCount(response?.data?.count);
            } else {
                if (response.statusCode === 401) {
                    logout();
                }
            }
        });
    }, [search, filterBy, reload]);

    useEffect(() => {
        handlePrevButtonClick();
    }, [count, pageSize]);

    useEffect(() => {
        setLoading(true);

        configService
            .getAllExpenses({
                search,
                filterBy,
                sortBy,
                page,
                pageSize,
            })
            .then((response) => {
                if (response.success) {
                    setExpenses(response?.data?.expenses);
                } else {
                    if (response.statusCode === 401) {
                        logout();
                    }
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, [search, filterBy, sortBy, page, pageSize, reload]);

    const loadPagesFromStart = (arr) => {
        for (let i = 1; i <= Math.min(Math.ceil(count / pageSize), 5); i++) {
            arr.push(i);
        }
    };

    const loadPagesFromEnd = (arr) => {
        for (
            let i = Math.ceil(count / pageSize);
            i >= Math.max(Math.ceil(count / pageSize) - 4, 1);
            i--
        ) {
            arr.unshift(i);
        }
    };

    const handlePageNumberClick = (e) => {
        const key = Number(e.target.textContent);
        const arr = [];
        if (key - 2 >= 1 && key + 2 <= Math.ceil(count / pageSize)) {
            for (let i = key - 2; i <= key + 2; i++) {
                arr.push(i);
            }
        } else if (key - 2 < 1) {
            loadPagesFromStart(arr);
        } else if (key + 2 > Math.ceil(count / pageSize)) {
            loadPagesFromEnd(arr);
        }
        setButtons(arr);
        setPage(key);
    };

    const handlePrevButtonClick = () => {
        const arr = [];
        loadPagesFromStart(arr);
        setButtons(arr);
        setPage(1);
    };

    const handleNextButtonClick = () => {
        const arr = [];
        loadPagesFromEnd(arr);
        setButtons(arr);
        setPage(Math.ceil(count / pageSize));
    };

    return (
        <>
            <div className={`home ${isAddEditPopupOpen && "overlay"}`}>
                <Nav avatar={avatar} />
                {/* overflow-auto works with static height only */}
                <div
                    className={`relative main-section ${
                        screenWidth >= breakpoint && "scrollbar"
                    } overflow-auto`}
                >
                    <ToolsPanel />
                    {loading ? (
                        <div
                            className="w-full absolute left-0"
                            style={{ top: "calc(50svh - 12.5px)" }}
                        >
                            <Loader />
                        </div>
                    ) : (
                        <div className="expenses">
                            {expenses.length === 0 ? (
                                <div className="flex w-full items-center justify-center">
                                    <p className="text-sm my-4">
                                        No items found
                                    </p>
                                </div>
                            ) : (
                                expenses.map((e) => (
                                    <Expense
                                        key={e._id}
                                        id={`#${e._id.substring(14)}`}
                                        name={e?.client.name}
                                        dueDate={e.dueDate}
                                        amount={e.amount}
                                        status={e.status}
                                        actionOnClick={() => {
                                            dispatch(
                                                setExpense({ expense: e })
                                            );
                                            dispatch(
                                                setIsAddEditPopupOpen({
                                                    isAddEditPopupOpen: true,
                                                })
                                            );
                                        }}
                                    />
                                ))
                            )}
                        </div>
                    )}
                    {!loading && expenses.length !== 0 && (
                        <div className="flex flex-col items-center md:flex-row-reverse md:justify-between md:mx-[0.75rem]">
                            <div className="page-buttons h-[3.125rem] md:mb-[11.25rem]">
                                <button
                                    className="h-full text-white p-4 px-5 bg-[#1f213a] hover:bg-[#1a1b30] rounded-l-lg"
                                    onClick={handlePrevButtonClick}
                                >
                                    {"<<"}
                                </button>
                                {buttons.map((button, index) => {
                                    return (
                                        <button
                                            key={index}
                                            className={`h-full text-white p-3 md:p-4  hover:bg-[#1a1b30] ${
                                                button === page
                                                    ? "bg-[#1a1b30]"
                                                    : "bg-[#1f213a]"
                                            }`}
                                            onClick={handlePageNumberClick}
                                        >
                                            {button}
                                        </button>
                                    );
                                })}
                                <button
                                    className="h-full text-white p-4 px-5 bg-[#1f213a] hover:bg-[#1a1b30] rounded-r-lg"
                                    onClick={handleNextButtonClick}
                                >
                                    {">>"}
                                </button>
                            </div>
                            <div className="w-32 my-4 mx-[auto] md:mx-0 md:my-0">
                                <DropdownMenu
                                    title="PAGE SIZE"
                                    className="rounded-lg mb-[11.25rem]"
                                    options={[
                                        { key: "20 / page", value: 20 },
                                        { key: "50 / page", value: 50 },
                                        { key: "100 / page", value: 100 },
                                    ]}
                                    isDropdownOpen={isPageDropdownOpen}
                                    setIsDropdownOpen={setIsPageDropdownOpen}
                                    selectedOption={pageSize}
                                    setSelectedOption={setPageSize}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <AddEditExpense />
        </>
    );
}

export default Home;
