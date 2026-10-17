export interface User {
    id: string;
    name: string;
    email: string;
    passwordH: string;
    monto: number;
}

export type SessionUser = Omit<User, 'passwordH'>

export interface registerUser {
    name: string;
    email: string;
    password: string;
}