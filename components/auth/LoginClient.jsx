"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Eye, EyeOff, CheckCircle2 } from "lucide-react";

import AuthShell from "./AuthShell";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { api } from "../../lib/api";

const EMAIL_RE = /^\S+@\S+\.\S+$/;

export default function LoginClient() {
  const router = useRouter();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [notice, setNotice] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mensaje cuando venimos de crear una cuenta
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("registered") === "1") {
      setNotice("Cuenta creada con éxito. Ya puedes iniciar sesión.");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setServerError("");
  };

  const validate = () => {
    const next = {};
    if (!form.email.trim()) next.email = "Ingresa tu correo";
    else if (!EMAIL_RE.test(form.email.trim()))
      next.email = "Ingresa un correo válido";
    if (!form.password) next.password = "Ingresa tu contraseña";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", {
        email: form.email.trim(),
        password: form.password,
      });

      const { token, user } = data;
      const role = user?.role;

      localStorage.setItem("token", token);
      if (role) localStorage.setItem("role", role);
      if (user) localStorage.setItem("user", JSON.stringify(user));

      // Avisa al header para que actualice la sesión
      window.dispatchEvent(new Event("vix:auth"));

      router.replace(role === "admin" ? "/dashboard" : "/");
    } catch (error) {
      setServerError(
        error?.response?.data?.message ||
          error?.response?.data?.msg ||
          "Correo o contraseña incorrectos"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Iniciar sesión"
      subtitle="Accede a tu cuenta para continuar."
      sideTitle="Tu estilo, a un paso."
      sideText="Miles de productos seleccionados para ti. Vuelve a donde lo dejaste."
      footer={
        <p className="text-center">
          ¿No tienes cuenta?{" "}
          <Link
            href="/register"
            className="font-semibold text-brand hover:underline"
          >
            Crear cuenta
          </Link>
        </p>
      }
    >
      {notice && (
        <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-success/30 bg-success/5 p-3 text-sm text-ink">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
          {notice}
        </div>
      )}

      {serverError && (
        <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-danger/30 bg-danger/5 p-3 text-sm text-danger">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label htmlFor="email" className="text-sm font-medium">
            Correo
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            placeholder="tucorreo@ejemplo.com"
            className="mt-1.5"
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-danger">{errors.email}</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium">
              Contraseña
            </label>
            <span className="text-xs text-muted">Mínimo 6 caracteres</span>
          </div>
          <div className="relative mt-1.5">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="pr-11"
              aria-invalid={Boolean(errors.password)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
              className="absolute right-1 top-1 flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-bone hover:text-ink"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-danger">{errors.password}</p>
          )}
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={loading}
          className="mt-2 w-full"
        >
          {loading ? "Entrando..." : "Iniciar sesión"}
        </Button>
      </form>
    </AuthShell>
  );
}
