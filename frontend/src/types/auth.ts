export interface FormLogin {
    nombre: string;
    correo: string;
    password: string;
    confirmPassword: string;
}

export type FormLoginErrors = Partial<Record<keyof FormLogin, string>>;