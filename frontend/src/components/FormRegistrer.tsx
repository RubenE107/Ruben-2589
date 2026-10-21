import { useState, type FormEvent, type ChangeEvent } from "react";
import { validateFormLogin } from "../utils/validar";
import { createUser } from "../services/users";
import type { FormLogin, FormLoginErrors } from "../types/auth";
import './FormRegistrer.css';

const INITIAL_STATE: FormLogin = {
    nombre: '',
    correo: '',
    password: '',
    confirmPassword: ''
};

export function FormRegistrer() {
    const [form, setForm] = useState<FormLogin>(INITIAL_STATE);
    const [errors, setErrors] = useState<FormLoginErrors>({});
    const [serverErrors, setServerErrors] = useState<string[] | null>(null);
    const [successMessage, setsuccessMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        if (errors[name as keyof FormLogin]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setServerErrors(null);
        setsuccessMessage(null);

        const validationErrors = validateFormLogin(form);
        
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);
        try {
            const newUser = await createUser({
                name: form.nombre,
                email: form.correo,
                password: form.password,
            });
            setsuccessMessage(`Usuario registrado exitosamente, ${newUser.name}. ¡Ahora puedes iniciar sesión!`);
            setForm(INITIAL_STATE);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setServerErrors([error.message]);
            } else {
                setServerErrors(['Ocurrió un error desconocido']);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className="register-form" onSubmit={handleSubmit} noValidate>
            <h2>Crear Cuenta</h2>

            {/* Aquí arreglamos el serverError para que no de error de renderizado */}
            {serverErrors && (
                <div className="form-alert error">
                    {serverErrors.join(' ')}
                </div>
            )}
            {successMessage && <div className="form-alert success">{successMessage}</div>}

            <div className="form-group">
                <label htmlFor="nombre">Nombre completo</label>
                <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    value={form.nombre}
                    onChange={handleChange}
                    className={errors.nombre ? 'input-error' : ''}
                    placeholder="Ej. Ana Pérez"
                />
                {errors.nombre && <span className="error-text">{errors.nombre}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="correo">Correo electrónico</label>
                <input
                    id="correo"
                    name="correo"
                    type="email"
                    value={form.correo}
                    onChange={handleChange}
                    className={errors.correo ? 'input-error' : ''}
                    placeholder="ana@ejemplo.com"
                />
                {errors.correo && <span className="error-text">{errors.correo}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    className={errors.password ? 'input-error' : ''}
                    placeholder="Mínimo 8 caracteres, letras y números"
                />
                {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar contraseña</label>
                <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className={errors.confirmPassword ? 'input-error' : ''}
                    placeholder="Repite tu contraseña"
                />
                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>

            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Registrando...' : 'Registrarse'}
            </button>
        </form>
    );
}