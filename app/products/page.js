"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";
import styles from "../styles/products.module.css";

export default function ProductosPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  const { addToCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => {
        if (!res.ok) throw Error("Error al obtener los productos");
        return res.json();
      })
      .then((dashboard) => {
        const dashboardNormalized = dashboard.map((p) => ({
          ...p,
          id: p._id || p.id,
          title: p.title || p.name,
          image: p.image || "https://via.placeholder.com/200",
          price: p.price || 0,
          description: p.description || "",
        }));
        setProducts(dashboardNormalized);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(products.length / productsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleBuy = (product) => {
    addToCart(product);
    router.push("/cart");
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Nuestra Colección</h1>
        <p>Joyería fina seleccionada para cada ocasión especial.</p>
      </header>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <span>Cargando productos...</span>
        </div>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        <>
          <div className={styles.grid}>
            {currentProducts.map((product) => (
              <article key={product.id} className={styles.card}>
                <div className={styles.imageWrapper}>
                  <img src={product.image} alt={product.title} />
                </div>
                <div className={styles.cardBody}>
                  <h3>{product.title}</h3>
                  <p className={styles.description}>{product.description}</p>
                  <p className={styles.price}>${product.price.toLocaleString("es-CO")}</p>
                  <button
                    className={styles.buyButton}
                    onClick={() => handleBuy(product)}
                  >
                    Comprar
                  </button>
                </div>
              </article>
            ))}
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button onClick={prevPage} disabled={currentPage === 1}>
                ← Anterior
              </button>
              <span>
                Página {currentPage} de {totalPages}
              </span>
              <button onClick={nextPage} disabled={currentPage === totalPages}>
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}