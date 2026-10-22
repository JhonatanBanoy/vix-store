"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  UserRound,
  Upload,
} from "lucide-react";

import AuthShell from "./AuthShell";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { api } from "../../lib/api";
import { cloudinaryConfig } from "../../app/config/cloudinary";

const EMAIL_RE = /^\S+@\S+\.\S+$/;

export default function RegisterClient() {
  const router = useRouter();
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setServerError("");
  };

  const validate = () => {
    const next = {};

    if (!form.name.trim()) next.name = "Ingresa tu nombre";
    else if (form.name.trim().length < 3)
      next.name = "El nombre es demasiado corto";

    if (!form.email.trim()) next.email = "Ingresa tu correo";
    else if (!EMAIL_RE.test(form.email.trim()))
      next.email = "Ingresa un correo válido";

    if (!form.password) next.password = "Crea una contraseña";
    else if (form.password.length < 6)
      next.password = "Debe tener al menos 6 caracteres";

    if (!form.confirm) next.confirm = "Confirma tu contraseña";
    else if (form.confirm !== form.password)
      next.confirm = "Las contraseñas no coinciden";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setServerError("");

    try {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", cloudinaryConfig.uploadPreset);

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
        data
      );

      setImageUrl(res.data.secure_url);
    } catch {
      setServerError("No se pudo subir la imagen. Intenta de nuevo.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setLoading(true);
    try {
      const email = form.email.trim().toLowerCase();

      await api.post("/auth/register", {
        name: form.name.trim(),
        email,
        password: form.password,
        role: "user",
        profileImage:
          imageUrl ||
          `https://api.dicebear.com/7.x/avatars/svg?seed=${encodeURIComponent(
            email
          )}`,
      });

      router.push("/login?registered=1");
    } catch (error) {
      setServerError(
        error?.response?.data?.message ||
          "No se pudo crear la cuenta. Intenta de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Crear cuenta"
      subtitle="Es rápido y solo necesitas un correo."
      sideTitle="Compra mejor, más rápido."
      sideText="Crea tu cuenta para guardar tus datos y seguir tus pedidos."
      footer={
        <p className="text-center">
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/login"
            className="font-semibold text-brand hover:underline"
          >
            Iniciar sesión
          </Link>
        </p>
      }
    >
      {serverError && (
        <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-danger/30 bg-danger/5 p-3 text-sm text-danger">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Foto */}
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-line bg-bone">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Foto de perfil"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-muted">
                <UserRound className="h-7 w-7" />
              </span>
            )}

            {uploading && (
              <span className="absolute inset-0 flex items-center justify-center bg-ink/50 text-white">
                <Loader2 className="h-5 w-5 animate-spin" />
              </span>
            )}
          </div>

          <div>
            <p className="text-sm font-medium">
              Foto de perfil{" "}
              <span className="font-normal text-muted">(opcional)</span>
            </p>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline disabled:opacity-50"
            >
              <Upload className="h-3.5 w-3.5" />
              {imageUrl ? "Cambiar imagen" : "Subir imagen"}
            </button>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
        </div>

        <div>
          <label htmlFor="name" className="text-sm font-medium">
            Nombre
          </label>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Tu nombre completo"
            className="mt-1.5"
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-danger">{errors.name}</p>
          )}
        </div>

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

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="password" className="text-sm font-medium">
              Contraseña
            </label>
            <div className="relative mt-1.5">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange}
                placeholder="Mínimo 6"
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

          <div>
            <label htmlFor="confirm" className="text-sm font-medium">
              Confirmar
            </label>
            <Input
              id="confirm"
              name="confirm"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={form.confirm}
              onChange={handleChange}
              placeholder="Repite la contraseña"
              className="mt-1.5"
              aria-invalid={Boolean(errors.confirm)}
            />
            {errors.confirm && (
              <p className="mt-1 text-xs text-danger">{errors.confirm}</p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={loading || uploading}
          className="mt-2 w-full"
        >
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </Button>

        <p className="text-center text-xs text-muted">
          Al crear tu cuenta aceptas nuestros términos y política de
          privacidad.
        </p>
      </form>
    </AuthShell>
  );
}
