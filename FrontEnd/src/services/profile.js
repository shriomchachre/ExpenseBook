import conf from "../conf/conf.js";
import Cookies from "js-cookie";

export class ProfileService {
    serverUrl;
    accessToken;

    constructor() {
        this.serverUrl = conf.serverUrl;
        this.accessToken = Cookies.get("accessToken");
    }

    async updatePassword({ password, newPassword }) {
        try {
            const payload = {
                password,
                newPassword,
            };

            const response = await fetch(
                `${this.serverUrl}/users/profile/password`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${this.accessToken}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    async updateProfile({ name, email, phone }) {
        try {
            const payload = {
                name,
                email,
                phone,
            };

            const response = await fetch(`${this.serverUrl}/users/profile`, {
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

    async updateAvatar({ avatar }) {
        try {
            const payload = {
                avatar,
            };

            const response = await fetch(
                `${this.serverUrl}/users/profile/avatar`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${this.accessToken}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    async deleteProfile({ email }) {
        try {
            const payload = {
                email,
            };

            const response = await fetch(`${this.serverUrl}/users/profile`, {
                method: "DELETE",
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
}

export default ProfileService;
