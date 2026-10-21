import type { FormLogin, FormLoginErrors } from '../types/auth';

export function validateFormLogin(form: FormLogin): FormLoginErrors {
  const errors: FormLoginErrors = {};

  if (!form.nombre || !form.nombre.trim()) {
    errors.nombre = 'El nombre es obligatorio.';
  }

 
  if (!form.correo || !form.correo.trim()) {
    errors.correo = 'El correo es obligatorio.';}


  if (!form.password) {
    errors.password = 'La contraseña es obligatoria.';
  } else if (form.password.length < 2) {
    errors.password = 'Debe tener al menos 2 caracteres.';}


  if (!form.confirmPassword) {
    errors.confirmPassword = 'Debes confirmar la contraseña.';
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden.';
  }

  return errors;
}