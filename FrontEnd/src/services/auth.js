import conf from "../conf/conf.js";
import Cookies from "js-cookie";

export class AuthService {
    serverUrl;
    accessToken;

    constructor() {
        this.serverUrl = conf.serverUrl;
        this.accessToken = Cookies.get("accessToken");
    }

    async register({ avatar = "", name, email, phone, password }) {
        try {
            const payload = {
                avatar,
                name,
                email,
                phone,
                password,
            };

            const response = await fetch(`${this.serverUrl}/users/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    async login({ email, password }) {
        try {
            const payload = {
                email,
                password,
            };

            const response = await fetch(`${this.serverUrl}/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    async logout() {
        try {
            const response = await fetch(`${this.serverUrl}/users/logout`, {
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

    async getCurrentUser() {
        try {
            const response = await fetch(`${this.serverUrl}/users/profile`, {
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
}

export default AuthService;
