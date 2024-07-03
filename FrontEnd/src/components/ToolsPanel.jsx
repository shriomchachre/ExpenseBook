import { useEffect, useState } from "react";
import { SearchBar, NewExpenseButton, DropdownMenu } from "./index.js";
import "./ToolsPanel.css";
import {
    filterBy as setFilterBy,
    sortBy as setSortBy,
} from "../store/toolsSlice.js";
import { useDispatch } from "react-redux";

function ToolsPanel() {
    const breakpoint = 576;
    const dispatch = useDispatch();
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [isFilterByDropdownOpen, setIsFilterByDropdownOpen] = useState(false);
    const [isSortByDropdownOpen, setIsSortByDropdownOpen] = useState(false);
    const [filterBySelectedOption, setFilterBySelectedOption] = useState("all");
    const [sortBySelectedOption, setSortBySelectedOption] = useState("asc");

    window.addEventListener("resize", () => {
        setScreenWidth(window.innerWidth);
    });

    const filterOptions = [
        { key: "All", value: "all" },
        { key: "Paid", value: "paid" },
        { key: "Pending", value: "pending" },
    ];
    const sortOptions = [
        { key: "Due date (asc)", value: "asc" },
        { key: "Due date (desc)", value: "desc" },
    ];

    useEffect(() => {
        dispatch(setFilterBy({ filterBy: filterBySelectedOption }));
        dispatch(setSortBy({ sortBy: sortBySelectedOption }));
    }, [filterBySelectedOption, sortBySelectedOption]);

    useEffect(() => {
        if (isFilterByDropdownOpen) {
            setIsSortByDropdownOpen(false);
        }
    }, [isFilterByDropdownOpen]);

    useEffect(() => {
        if (isSortByDropdownOpen) {
            setIsFilterByDropdownOpen(false);
        }
    }, [isSortByDropdownOpen]);

    return (
        <div className="search-filter-actions-pannel">
            {screenWidth >= breakpoint ? (
                <>
                    <div className="search-bar-and-add-btn-container flex justify-between">
                        <SearchBar placeholder="Search names, emails, and expense ids" />
                        <div className="flex" style={{ flexGrow: 1 }}>
                            <DropdownMenu
                                title="FILTER BY"
                                className="rounded-tl-lg rounded-bl-lg"
                                options={filterOptions}
                                isDropdownOpen={isFilterByDropdownOpen}
                                setIsDropdownOpen={setIsFilterByDropdownOpen}
                                selectedOption={filterBySelectedOption}
                                setSelectedOption={setFilterBySelectedOption}
                            />
                            <DropdownMenu
                                title="SORT BY"
                                className="rounded-tr-lg rounded-br-lg"
                                options={sortOptions}
                                isDropdownOpen={isSortByDropdownOpen}
                                setIsDropdownOpen={setIsSortByDropdownOpen}
                                selectedOption={sortBySelectedOption}
                                setSelectedOption={setSortBySelectedOption}
                                style={{ borderLeft: "0.75px solid #4c4e6a" }}
                            />
                        </div>
                        <NewExpenseButton />
                    </div>
                </>
            ) : (
                <>
                    <div className="search-bar-and-add-btn-container flex justify-between">
                        <SearchBar placeholder="Search names, emails, and expense ids" />
                        <NewExpenseButton />
                    </div>
                    <div className="sort-and-filter-container flex items-center">
                        <DropdownMenu
                            title="FILTER BY"
                            className="rounded-tl-lg rounded-bl-lg"
                            options={filterOptions}
                            isDropdownOpen={isFilterByDropdownOpen}
                            setIsDropdownOpen={setIsFilterByDropdownOpen}
                            selectedOption={filterBySelectedOption}
                            setSelectedOption={setFilterBySelectedOption}
                        />
                        <DropdownMenu
                            title="SORT BY"
                            className="rounded-tr-lg rounded-br-lg"
                            options={sortOptions}
                            isDropdownOpen={isSortByDropdownOpen}
                            setIsDropdownOpen={setIsSortByDropdownOpen}
                            selectedOption={sortBySelectedOption}
                            setSelectedOption={setSortBySelectedOption}
                            style={{ borderLeft: "0.75px solid #4c4e6a" }}
                        />
                    </div>
                </>
            )}
        </div>
    );
}

export default ToolsPanel;
