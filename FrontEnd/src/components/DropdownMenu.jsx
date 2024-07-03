import "./DropdownMenu.css";
import downArrow from "../assets/arrow-down.png";
import { useEffect, useRef, useState } from "react";

function DropdownMenu({
    title,
    className = "",
    options = [],
    isDropdownOpen,
    setIsDropdownOpen,
    selectedOption,
    setSelectedOption,
    ...props
}) {
    const [dropdownClicks, setDropdownClicks] = useState(0);
    const optionsContainerRef = useRef(null);
    const arrowRef = useRef(null);

    const addCssClass = (element, cssClass) => {
        element.classList.add(cssClass);
    };

    const removeCssClass = (element, cssClass) => {
        element.classList.remove(cssClass);
    };

    useEffect(() => {
        if (isDropdownOpen) {
            // show dropdown options
            removeCssClass(optionsContainerRef.current, "hide");
            addCssClass(optionsContainerRef.current, "show");

            // rotate arrow upwards
            if (dropdownClicks > 0) {
                removeCssClass(arrowRef.current, "rotate-downwards");
                addCssClass(arrowRef.current, "rotate-upwards");
            }
        } else {
            // hide dropdown options
            removeCssClass(optionsContainerRef.current, "show");
            addCssClass(optionsContainerRef.current, "hide");

            // rotate arrow downwards
            if (dropdownClicks > 0) {
                removeCssClass(arrowRef.current, "rotate-upwards");
                addCssClass(arrowRef.current, "rotate-downwards");
            }
        }
    }, [isDropdownOpen]);

    return (
        <div
            style={{ width: "100%", position: "relative" }}
            className="flex flex-col"
        >
            <div
                className={`dropdown-menu flex justify-between items-center ${className}`}
                {...props}
                onClick={function () {
                    setDropdownClicks(dropdownClicks + 1);
                    setIsDropdownOpen((prev) => !prev);
                }}
            >
                <p>{title}</p>
                <img src={downArrow} alt="arrow" ref={arrowRef} />
            </div>
            <div className="options-container hide" ref={optionsContainerRef}>
                {options.map((option) => {
                    return (
                        <div
                            key={option.value}
                            className="option-container"
                            onClick={() => {
                                setSelectedOption(option.value);
                                setIsDropdownOpen((prev) => !prev);
                            }}
                        >
                            <div
                                className={`option flex items-center ${
                                    selectedOption === option.value &&
                                    "selected"
                                }`}
                            >
                                <p>{option.key}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default DropdownMenu;
