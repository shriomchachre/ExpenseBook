import conf from "../conf/conf.js";
import Cookies from "js-cookie";

export class ConfigService {
    serverUrl;
    accessToken;

    constructor() {
        this.serverUrl = conf.serverUrl;
        this.accessToken = Cookies.get("accessToken");
    }

    async getAllExpenses({
        search = "",
        filterBy = "all",
        sortBy = "asc",
        page = 1,
        pageSize = 20,
    }) {
        try {
            let url;
            if (!filterBy.includes("all")) {
                url = `${this.serverUrl}/expenses?search=${search}&status=${filterBy}&sort=dueDate ${sortBy}&page=${page}&pageSize=${pageSize}`;
            } else {
                url = `${this.serverUrl}/expenses?search=${search}&sort=dueDate ${sortBy}&page=${page}&pageSize=${pageSize}`;
            }

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                },
            });

            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    async addExpense({
        clientEmail,
        dueDate,
        description,
        amount,
        status = false,
    }) {
        try {
            const payload = {
                clientEmail,
                dueDate,
                description,
                amount,
                status,
            };

            const response = await fetch(`${this.serverUrl}/expenses`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.accessToken}`,
                },
                body: JSON.stringify(payload),
            });

            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    async getCount({ search = "", filterBy = "all" }) {
        try {
            let url;
            if (!filterBy.includes("all")) {
                url = `${this.serverUrl}/expenses/count?search=${search}&status=${filterBy}`;
            } else {
                url = `${this.serverUrl}/expenses/count?search=${search}`;
            }

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                },
            });

            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    async getExpense({ id }) {
        try {
            const response = await fetch(`${this.serverUrl}/expenses/${id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                },
            });

            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    async updateExpense({
        id,
        clientEmail,
        dueDate,
        description,
        amount,
        status = false,
    }) {
        try {
            const payload = {
                clientEmail,
                dueDate,
                description,
                amount,
                status,
            };

            const response = await fetch(`${this.serverUrl}/expenses/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.accessToken}`,
                },
                body: JSON.stringify(payload),
            });

            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    async deleteExpense({ id }) {
        try {
            const response = await fetch(`${this.serverUrl}/expenses/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                },
            });

            return await response.json();
        } catch (error) {
            throw error;
        }
    }
}

export default ConfigService;
