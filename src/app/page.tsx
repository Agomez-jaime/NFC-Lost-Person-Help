export default function HomePage() {
  return (
    <main className="page">
      <div className="card">
        <h1>Ayuda para encontrar el camino</h1>
        <p>
          Este sitio funciona junto con etiquetas NFC/QR pensadas para ayudar a niños,
          niñas y personas mayores en caso de que se pierdan. Cada etiqueta tiene su
          propia página privada.
        </p>
        <p>
          <a href="/admin">Ir al panel del cuidador</a>
        </p>
      </div>
    </main>
  );
}
