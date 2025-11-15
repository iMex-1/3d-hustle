// Admin-only authentication system
export const adminUser = {
    id: 1,
    username: "admin",
    password: "admin123",
    role: "admin",
    email: "admin@3dmarketplace.com"
};

export const authenticateAdmin = (username, password) => {
    if (username === adminUser.username && password === adminUser.password) {
        return adminUser;
    }
    return null;
};
