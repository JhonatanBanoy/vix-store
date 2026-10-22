"use client"; // Requerido para usar hooks como useState
import { useState } from 'react';
import dynamic from "next/dynamic";
import "bootstrap/dist/css/bootstrap.min.css";
import { Toast, ToastContainer } from "react-bootstrap";

import styles from '../styles/contact.module.css';

const MapComponent = dynamic(() => import('../components/MapComponent'), {
  ssr: false,
});

export default function Contact() {
  const [formData, setForData] = useState({
    name: "",
    email: "",
    message: "",
  });

  // Manejando el estado de carga
  const [loading, setLoading] = useState(false); 
  // Estado para mostrar la notificación 
  const [showToast, setShowToast] = useState(false);
  //Manejo del mensaje del toast
  const [toastMessage, setToastMessage] = useState("");
  // Color del toast
  const [toastVariant, setToastVariant] = useState("success");


  // Manejando el cambio de los inputs
  const handleChange = (e) => {
    setForData({ ...formData, [e.target.name]: e.target.value });

  }

  // Manejando el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // try
    try{
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok){
        setToastMessage("Correo enviado con éxito");
        setToastVariant("success");
        // Ayuda a Reset
        setForData({name: "", email: "", message: ""});
      }else{
        setToastMessage(`Error al enviar el correo: ${result.error}`);
        setToastVariant("danger");
        }
      }catch (error){
        setToastMessage("Hubo un problema al enviar el correo");
        setToastVariant("danger");
        console.error("Error: ", error);
      } finally{
        setShowToast(true); // Mostrar notifcaciones 
        setLoading(false);
      }
    };
    



  return (
    <div className={styles.container}>
      {/* Notificacion con Bootstrap*/}

      <ToastContainer position="top-end" className="p-3">
        <Toast bg={toastVariant} show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide>
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      {/* Incorporar el component del mapa */}
      <div className={styles.intro}>
        <MapComponent />
      </div>

      {/* Contenedor del Form */}
      <div className={styles.form}>
        <h1>Contacto</h1>
        <form onSubmit={handleSubmit}>
          <label>Nombre:</label>
          <input type='text' name='name' value={formData.name} onChange={handleChange} required placeholder='Ingresa un nombre'/>

          <label>Email:</label>
          <input type='email' name='email' value={formData.email} onChange={handleChange} required placeholder='Ingresar un correo'/>

          <label>Message:</label>
          <textarea name='message' value={formData.message} onChange={handleChange} required/>


          <button type='submit' disabled={loading}>
            {loading ? "Enviando..." : "Enviar"}
            
          </button>         
        </form>
      </div>
    </div>
  )
}











