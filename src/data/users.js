// Mock user authentication system
export const users = [
    {
        id: 1,
        username: "admin",
        password: "admin123",
        role: "admin",
        email: "admin@3dwebsite.com"
    },
    {
        id: 2,
        username: "user",
        password: "user123",
        role: "user",
        email: "user@example.com"
    }
];

export const authenticateUser = (username, password) => {
    return users.find(u => u.username === username && u.password === password);
};

export const registerUser = (username, email, password) => {
    const newUser = {
        id: users.length + 1,
        username,
        email,
        password,
        role: "user"
    };
    users.push(newUser);
    return newUser;
};
