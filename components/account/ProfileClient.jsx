"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Upload,
  UserRound,
} from "lucide-react";

import Container from "../layout/Container";
import Breadcrumbs from "../catalog/Breadcrumbs";
import Badge from "../ui/Badge";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Toast from "../ui/Toast";
import { api } from "../../lib/api";
import { cloudinaryConfig } from "../../app/config/cloudinary";

const EMAIL_RE = /^\S+@\S+\.\S+$/;

const clearSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("role");
  window.dispatchEvent(new Event("vix:auth"));
};

export default function ProfileClient() {
  const router = useRouter();
  const fileRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [role, setRole] = useState("user");
  const [imageUrl, setImageUrl] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [toast, setToast] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    let alive = true;

    (async () => {
      try {
        const { data } = await api.get("/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!alive) return;

        setForm({
          name: data.name || "",
          email: data.email || "",
          password: "",
          confirm: "",
        });
        setRole(data.role || "user");
        setImageUrl(data.profileImage || "");
      } catch (err) {
        if (!alive) return;

        if (err?.response?.status === 401) {
          clearSession();
          router.replace("/login?expired=1");
          return;
        }

        setError("No se pudo cargar el perfil. Intenta de nuevo.");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

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
      setError("No se pudo subir la imagen. Intenta de nuevo.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError("Ingresa tu nombre");
      return;
    }
    if (!EMAIL_RE.test(form.email.trim())) {
      setError("Ingresa un correo válido");
      return;
    }
    if (form.password && form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (form.password && form.password !== form.confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
      };
      if (imageUrl) payload.profileImage = imageUrl;
      if (form.password) payload.password = form.password;

      const { data } = await api.put("/auth/profile", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let stored = {};
      try {
        stored = JSON.parse(localStorage.getItem("user")) || {};
      } catch {
        stored = {};
      }

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...stored,
          name: data.name,
          email: data.email,
          profileImage: data.profileImage,
        })
      );

      window.dispatchEvent(new Event("vix:auth"));

      setForm((prev) => ({
        ...prev,
        name: data.name || "",
        email: data.email || "",
        password: "",
        confirm: "",
      }));
      setImageUrl(data.profileImage || "");
      setSuccess("Perfil actualizado correctamente");
      setToast({
        type: "success",
        message: "Perfil actualizado correctamente",
      });
    } catch (err) {
      if (err?.response?.status === 401) {
        clearSession();
        router.replace("/login?expired=1");
        return;
      }

      const message =
        err?.response?.data?.message || "No se pudo actualizar el perfil";
      setError(message);
      setToast({ type: "error", message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-10">
        <div className="h-4 w-40 animate-pulse rounded bg-bone" />
        <div className="mt-6 grid gap-8 lg:grid-cols-[320px_1fr]">
          <div className="h-80 animate-pulse rounded-2xl bg-bone" />
          <div className="h-80 animate-pulse rounded-2xl bg-bone" />
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-10">
      <Toast
        open={Boolean(toast)}
        type={toast?.type}
        message={toast?.message}
        onClose={() => setToast(null)}
      />

      <Breadcrumbs
        items={[{ label: "Inicio", href: "/" }, { label: "Mi perfil" }]}
      />

      <div className="mt-4">
        <h1 className="text-2xl font-bold sm:text-3xl">Mi perfil</h1>
        <p className="mt-1 text-sm text-muted">
          Administra tus datos y tu foto de perfil.
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[320px_1fr]">
        {/* Tarjeta de cuenta */}
        <aside className="h-fit rounded-2xl border border-line bg-paper p-6 text-center lg:sticky lg:top-24">
          <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-full border border-line bg-bone">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={form.name || "Foto de perfil"}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-muted">
                <UserRound className="h-10 w-10" />
              </span>
            )}

            {uploading && (
              <span className="absolute inset-0 flex items-center justify-center bg-ink/50 text-white">
                <Loader2 className="h-6 w-6 animate-spin" />
              </span>
            )}
          </div>

          <h2 className="mt-4 font-display text-lg font-bold">
            {form.name || "Tu nombre"}
          </h2>
          <p className="mt-0.5 break-all text-sm text-muted">{form.email}</p>

          <Badge
            variant={role === "admin" ? "soft" : "muted"}
            className="mt-3"
          >
            {role === "admin" ? "Administrador" : "Cliente"}
          </Badge>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            className="mt-5 w-full"
          >
            <Upload className="h-4 w-4" />
            {uploading ? "Subiendo..." : "Cambiar foto"}
          </Button>

          <div className="mt-6 space-y-2 border-t border-line pt-5 text-left text-sm">
            <Link
              href="/cart"
              className="block rounded-lg px-3 py-2 text-muted transition-colors hover:bg-bone hover:text-ink"
            >
              Mi carrito
            </Link>
            <Link
              href="/products"
              className="block rounded-lg px-3 py-2 text-muted transition-colors hover:bg-bone hover:text-ink"
            >
              Seguir comprando
            </Link>
          </div>
        </aside>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          autoComplete="off"
          className="rounded-2xl border border-line bg-paper p-5 sm:p-6"
        >
          <h2 className="font-display text-lg font-bold">Datos personales</h2>
          <p className="mt-1 text-sm text-muted">
            El correo es el mismo con el que inicias sesión.
          </p>

          {error && (
            <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-danger/30 bg-danger/5 p-3 text-sm text-danger">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-success/30 bg-success/5 p-3 text-sm text-ink">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              {success}
            </div>
          )}

          <div className="mt-5 space-y-4">
            <div>
              <label htmlFor="name" className="text-sm font-medium">
                Nombre
              </label>
              <Input
                id="name"
                name="name"
                autoComplete="off"
                value={form.name}
                onChange={handleChange}
                placeholder="Tu nombre completo"
                className="mt-1.5"
              />
            </div>

            <div>
              <label htmlFor="email" className="text-sm font-medium">
                Correo
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="off"
                value={form.email}
                onChange={handleChange}
                placeholder="tucorreo@ejemplo.com"
                className="mt-1.5"
              />
              <p className="mt-1 text-xs text-muted">
                Si lo cambias, deberás iniciar sesión con el nuevo correo.
              </p>
            </div>

            <div className="border-t border-line pt-4">
              <p className="text-sm font-medium">Cambiar contraseña</p>
              <p className="mt-0.5 text-xs text-muted">
                Déjalo en blanco si no quieres cambiarla.
              </p>

              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="password"
                    className="text-xs font-medium text-muted"
                  >
                    Nueva contraseña
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
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={
                        showPassword
                          ? "Ocultar contraseña"
                          : "Mostrar contraseña"
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
                </div>

                <div>
                  <label
                    htmlFor="confirm"
                    className="text-xs font-medium text-muted"
                  >
                    Confirmar contraseña
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
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:items-center">
            <Button type="submit" disabled={saving || uploading}>
              {saving ? "Guardando..." : "Guardar cambios"}
            </Button>
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center rounded-xl px-4 text-sm font-medium text-muted transition-colors hover:bg-bone hover:text-ink"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </Container>
  );
}
