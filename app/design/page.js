import {
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  Search,
  Sparkles,
} from "lucide-react";

import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Card, { CardHeader, CardBody, CardFooter } from "../../components/ui/Card";
import Skeleton, { SkeletonCard } from "../../components/ui/Skeleton";
import Input from "../../components/ui/Input";

const palette = [
  { name: "Paper", hex: "#FFFFFF", className: "bg-paper", text: "text-ink" },
  { name: "Bone", hex: "#F6F4F0", className: "bg-bone", text: "text-ink" },
  { name: "Ink", hex: "#0B0B0F", className: "bg-ink", text: "text-white" },
  { name: "Muted", hex: "#6B7280", className: "bg-muted", text: "text-white" },
  { name: "Line", hex: "#E7E5E4", className: "bg-line", text: "text-ink" },
  { name: "Brand", hex: "#5B3DF5", className: "bg-brand", text: "text-white" },
  { name: "Brand Soft", hex: "#EDEBFF", className: "bg-brand-soft", text: "text-brand" },
  { name: "Deal", hex: "#FFB020", className: "bg-deal", text: "text-ink" },
  { name: "Success", hex: "#16A34A", className: "bg-success", text: "text-white" },
  { name: "Danger", hex: "#DC2626", className: "bg-danger", text: "text-white" },
];

export default function DesignPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-12 py-10">
      {/* Encabezado */}
      <header className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="soft">
            <Sparkles className="h-3 w-3" /> Paso 2
          </Badge>
          <span className="text-sm text-muted">Sistema de diseño Vix</span>
        </div>
        <h1 className="text-4xl font-bold">Identidad visual</h1>
        <p className="max-w-2xl text-muted">
          Esta página es solo de referencia. Reúne los colores, la tipografía y los
          componentes base que usaremos en toda la tienda.
        </p>
      </header>

      {/* Logo */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted">
          Logotipo (provisional)
        </h2>
        <Card className="p-8">
          <span className="font-display text-5xl font-bold tracking-tight">
            V<span className="text-brand">I</span>X
          </span>
          <p className="mt-3 text-sm text-muted">
            Provisional en texto. El logo definitivo está pendiente de aprobación.
          </p>
        </Card>
      </section>

      {/* Paleta */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted">
          Paleta
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {palette.map((c) => (
            <div
              key={c.name}
              className={`rounded-card border border-line p-4 ${c.className} ${c.text}`}
            >
              <p className="text-sm font-semibold">{c.name}</p>
              <p className="mt-1 text-xs opacity-70">{c.hex}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tipografía */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted">
          Tipografía
        </h2>
        <Card className="space-y-6 p-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted">
              Space Grotesk · display
            </p>
            <p className="mt-2 font-display text-4xl font-bold">
              Diseño que se siente premium
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-muted">
              Inter · texto
            </p>
            <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted">
              Inter está pensada para leerse con claridad en cualquier pantalla.
              La usaremos en párrafos, formularios, precios y botones.
            </p>
          </div>
        </Card>
      </section>

      {/* Botones */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted">
          Botones
        </h2>
        <Card className="flex flex-wrap items-center gap-3 p-6">
          <Button>
            <ShoppingBag className="h-4 w-4" /> Añadir al carrito
          </Button>
          <Button variant="secondary">Comprar ahora</Button>
          <Button variant="outline">Ver más</Button>
          <Button variant="ghost">Cancelar</Button>
          <Button variant="deal">Oferta</Button>
          <Button variant="danger">Eliminar</Button>
          <Button disabled>Deshabilitado</Button>
          <Button size="sm">Pequeño</Button>
          <Button size="lg">Grande</Button>
        </Card>
      </section>

      {/* Badges */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted">
          Etiquetas
        </h2>
        <Card className="flex flex-wrap items-center gap-3 p-6">
          <Badge variant="new">Nuevo</Badge>
          <Badge variant="sale">-30%</Badge>
          <Badge variant="soft">Recomendado</Badge>
          <Badge variant="success">Disponible</Badge>
          <Badge variant="danger">Agotado</Badge>
          <Badge variant="muted">Borrador</Badge>
        </Card>
      </section>

      {/* Formulario */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted">
          Campos
        </h2>
        <Card className="grid gap-4 p-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nombre</label>
            <Input placeholder="Tu nombre" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Correo</label>
            <Input type="email" placeholder="tu@correo.com" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-medium">Búsqueda</label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <Input className="pl-11" placeholder="Buscar productos..." />
            </div>
          </div>
        </Card>
      </section>

      {/* Barra de confianza */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted">
          Barra de confianza
        </h2>
        <Card className="grid gap-4 p-6 sm:grid-cols-3">
          {[
            { icon: Truck, title: "Envío", text: "A todo el país" },
            { icon: ShieldCheck, title: "Pago seguro", text: "Datos protegidos" },
            { icon: RotateCcw, title: "Devoluciones", text: "Hasta 30 días" },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft text-brand">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-xs text-muted">{text}</p>
              </div>
            </div>
          ))}
        </Card>
      </section>

      {/* Tarjeta de producto */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted">
          Tarjeta de producto
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="group overflow-hidden">
            <div className="relative flex aspect-[4/5] items-center justify-center bg-brand-soft text-sm text-brand">
              <Badge variant="sale" className="absolute left-3 top-3">
                -30%
              </Badge>
              Imagen 4:5
            </div>
            <div className="space-y-2 p-4">
              <p className="text-sm font-semibold">Audífonos inalámbricos</p>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold">$ 89.900</span>
                <span className="text-sm text-muted line-through">$ 129.900</span>
              </div>
              <p className="text-xs font-medium text-success">Envío a todo el país</p>
            </div>
          </Card>

          <SkeletonCard />
          <SkeletonCard />
        </div>
      </section>

      {/* Card con header/footer */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted">
          Card compuesta
        </h2>
        <Card className="max-w-md">
          <CardHeader>
            <p className="text-sm font-semibold">Resumen del pedido</p>
          </CardHeader>
          <CardBody className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Subtotal</span>
              <span>$ 89.900</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Envío</span>
              <span className="text-muted">Según ciudad</span>
            </div>
          </CardBody>
          <CardFooter className="flex items-center justify-between">
            <span className="text-sm font-semibold">Total</span>
            <span className="text-lg font-bold">$ 89.900</span>
          </CardFooter>
        </Card>
      </section>

      <footer className="border-t border-line pt-6 text-xs text-muted">
        Página de referencia interna · Vix Design System
      </footer>
    </div>
  );
}
