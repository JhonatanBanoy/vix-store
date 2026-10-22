"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";
import styles from "../styles/home.module.css";

const products = [
  {
    id: 1,
    image: "/img/im1.jpg",
    name: "Anillo Imperial",
    description: "Diamantes engastados en oro blanco 18k.",
    price: 1250,
  },
  {
    id: 2,
    image: "/img/im2.jpg",
    name: "Pulsera Real",
    description: "Diseño elegante con baño de oro puro.",
    price: 890,
  },
  {
    id: 3,
    image: "/img/im3.jpg",
    name: "Aretes Lunares",
    description: "Perlas naturales y oro 24k.",
    price: 640,
  },
  {
    id: 4,
    image: "/img/im4.jpg",
    name: "Collar Aurora",
    description: "Brilla con zafiros y diamantes.",
    highlight: true,
    price: 2100,
  },
  {
    id: 5,
    image: "/img/im5.jpg",
    name: "Reloj Dorado",
    description: "Precisión suiza y estilo clásico.",
    price: 1750,
  },
  {
    id: 6,
    image: "/img/im6.jpg",
    name: "Sortija Vintage",
    description: "Inspirada en la realeza del siglo XIX.",
    price: 980,
  },
  {
    id: 7,
    image: "/img/im7.jpg",
    name: "Gargantilla Luxe",
    description: "Toques de esmeralda y platino.",
    price: 1320,
  },
  {
    id: 8,
    image: "/img/im8.jpg",
    name: "Broche Estelar",
    description: "Perfecto para ocasiones especiales.",
    highlight: true,
    price: 1540,
  },
  {
    id: 9,
    image: "/img/im9.jpg",
    name: "Anillo Eternidad",
    description: "Diseño infinito con brillantes puros.",
    price: 1680,
  },
  {
    id: 10,
    image: "/img/im10.jpg",
    name: "Pendientes Royal",
    description: "Oro rosa con diamantes incrustados.",
    price: 1120,
  },
  {
    id: 11,
    image: "/img/im11.jpg",
    name: "Collar Diamante",
    description: "Simpleza elegante, oro 22k.",
    price: 1470,
  },
  {
    id: 12,
    image: "/img/im12.jpg",
    name: "Anillo de Compromiso",
    description: "Piedra central con corte princesa.",
    highlight: true,
    price: 2600,
  },
  {
    id: 13,
    image: "/img/im13.jpg",
    name: "Pulsera Delicada",
    description: "Detalles sutiles y femeninos.",
    price: 720,
  },
  {
    id: 14,
    image: "/img/im14.jpg",
    name: "Broche de Flor",
    description: "Inspirado en la naturaleza, elegante y fresco.",
    price: 850,
  },
  {
    id: 15,
    image: "/img/im15.jpg",
    name: "Anillo Rubí",
    description: "Pasión intensa con un toque clásico.",
    price: 1990,
  },
  {
    id: 16,
    image: "/img/im16.jpg",
    name: "Collar Estrella",
    description: "Brilla como el firmamento.",
    price: 1380,
  },
  {
    id: 17,
    image: "/img/im17.jpg",
    name: "Pendientes Hoja",
    description: "Diseño botánico en oro rosado.",
    price: 760,
  },
  {
    id: 18,
    image: "/img/im18.jpg",
    name: "Sortija Coral",
    description: "Color vibrante y diseño atrevido.",
    price: 1180,
  },
  {
    id: 19,
    image: "/img/im19.jpg",
    name: "Gargantilla Dama",
    description: "Ideal para cenas elegantes.",
    price: 1040,
  },
  {
    id: 20,
    image: "/img/im20.jpg",
    name: "Anillo Minimal",
    description: "Estilo sencillo, impacto fuerte.",
    price: 580,
  },
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const { addToCart } = useCart();
  const router = useRouter();

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBuy = (product) => {
    addToCart({
      ...product,
      title: product.name,
    });
    router.push("/cart");
  };

  return (
    <div>
      {/* Hero principal */}
      <section className={styles.hero}>
        <img
          src="/img/portadajoyeria.jpg"
          alt="Hero joyería"
          className={styles.heroImage}
        />
        <div className={styles.heroContent}>
          <h1>Brilla con elegancia</h1>
          <p>
            Explora nuestra colección de joyería fina para cada ocasión especial.
          </p>
          <a href="/products">
            <button className={styles.btn}>Explorar ahora</button>
          </a>
        </div>
      </section>

      {/* Sección informativa */}
      <section className={styles.infoSection}>
        <div className={styles.infoWrapper}>
          <div className={styles.infoImage}>
            <img src="/img/bridaljelwery.jpg" alt="Joyería de lujo" />
          </div>
          <div className={styles.infoText}>
            <h2>Descubre el arte de la elegancia</h2>
            <p>
              Cada pieza de nuestra joyería está diseñada para resaltar lo mejor
              de ti. Fusionamos técnicas artesanales con materiales exquisitos
              para crear joyas que perduran en el tiempo.
              <br /><br />
              Desde delicados detalles hasta acabados brillantes, nuestras
              colecciones capturan momentos eternos y reflejan tu esencia única.
            </p>
          </div>
        </div>
      </section>

      {/* 🔍 Buscador */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      

      {/* Productos + info intermedia */}
      <div className={styles.productsContainer}>
        {filteredProducts.map((product, index) => (
          <React.Fragment key={`product-${product.id}`}>
            <div
              className={
                index === 3 || product.highlight
                  ? styles.productHighlight
                  : styles.product
              }
            >
              <div className={styles.imageWrapper}>
                <img src={product.image} alt={product.name} />
              </div>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p className={styles.productPrice}>${product.price}</p>
              <button
                className={styles.btn}
                onClick={() => handleBuy(product)}
              >
                Comprar
              </button>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Frase motivacional */}
      <section className={styles.motivationalSection}>
        <p className={styles.motivationalText}>
          "Cada joya cuenta una historia. Que la tuya brille para siempre."
          <small>&copy; 2025 Joyas de Autor</small>
        </p>
      </section>
    </div>
  );
}
