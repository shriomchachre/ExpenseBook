import React, { useId } from "react";

function Input({ label, type = "text", className = "", ...props }, ref) {
    const id = useId();

    return (
        <div className="w-full">
            {label && (
                <label htmlFor={id} className="text-sm">
                    {label}
                </label>
            )}
            <input
                id={id}
                type={type}
                className={`outline-none mt-1 ${className}`}
                {...props}
                ref={ref}
            />
        </div>
    );
}

export default React.forwardRef(Input);
