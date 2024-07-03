import ApiError from "./ApiError.js";

const validatePassword = ({ password, required, isNewPassword }) => {
    if (password === undefined)
        throw new ApiError(
            400,
            `${isNewPassword ? "New password" : "Password"} field is missing.`
        );

    password = password.trim();
    if (required) {
        if (password.length === 0) {
            throw new ApiError(
                400,
                `${isNewPassword ? "New password" : "Password"} is required.`
            );
        }
    }

    if (password.length > 0) {
        const passwordPattern =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!passwordPattern.test(password)) {
            throw new ApiError(
                400,
                `${isNewPassword ? "New password" : "Password"} must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one digit, and one special character.`
            );
        }
    }
};

const validateForm = {
    name: function ({ name, required = false }) {
        if (name === undefined)
            throw new ApiError(400, "Name field is missing.");

        name = name.trim();

        if (required) {
            if (name.length === 0) {
                throw new ApiError(400, "Name is required.");
            }
        }

        if (name.length > 0) {
            const namePattern = /^[a-zA-Z\s]+$/;
            if (!namePattern.test(name)) {
                throw new ApiError(
                    400,
                    "Please enter a valid name with only letters and spaces."
                );
            }
        }
    },

    email: function ({ email, required = false }) {
        if (email === undefined)
            throw new ApiError(400, "Email field is missing.");

        email = email.trim();
        if (required) {
            if (email.length === 0) {
                throw new ApiError(400, "Email is required.");
            }
        }

        if (email.length > 0) {
            const emailPattern =
                /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

            if (!emailPattern.test(email)) {
                throw new ApiError(400, "Please enter a valid email address.");
            }
        }
    },

    phone: function ({ phone, required = false }) {
        if (phone === undefined)
            throw new ApiError(400, "Phone number field is missing.");

        phone = phone.trim();
        if (required) {
            if (phone === "") {
                throw new ApiError(400, "Phone number is required.");
            }
        }

        if (phone !== "") {
            const phonePattern =
                /^[+]{1}(?:[0-9\-\\(\\)\\/.]\s?){6,15}[0-9]{1}$/;

            if (!phonePattern.test(phone)) {
                throw new ApiError(
                    400,
                    "Please enter a valid phone number. Example: +911234567890"
                );
            }
        }
    },

    password: function ({ password, required = false, isNewPassword = false }) {
        validatePassword({ password, required, isNewPassword });
    },

    date: function ({ date, required = false }) {
        if (date === undefined)
            throw new ApiError(400, "Date field is missing.");

        date = date.trim();
        if (required) {
            if (date === "") {
                throw new ApiError(400, "Date is required.");
            }
        }

        if (date !== "") {
            let isDateValid = true;

            const datePattern =
                /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

            if (!datePattern.test(date)) {
                isDateValid = false;
            }

            const [day, month, year] = date.split("/");
            const daysInMonth = new Date(year, month, 0).getDate();

            if (day > daysInMonth) {
                isDateValid = false;
            }

            if (!isDateValid) {
                throw new ApiError(
                    400,
                    "Please enter a valid date in the format dd/mm/yyyy, ensuring that the day and month values are within the correct ranges, and the date exists on the calendar."
                );
            }
        }
    },
};

export default validateForm;
