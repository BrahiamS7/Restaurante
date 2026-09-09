export default function MesaCard({ mesa, onClick }) {
  const estado = mesa.estadoM;

  const estadoTexto = {
    LIBRE: "Libre",
    OCUPADA: "Ocupada",
    RESERVADA: "Reservada",
  };

  return (
    <button
      className={`mesa-card mesa-${estado.toLowerCase()}`}
      onClick={() => onClick(mesa)}
    >
      <div className="mesa-number">
        {mesa.id}
      </div>

      <div className="mesa-info">
        <strong>Mesa {mesa.id}</strong>

        <span>
          <span className="status-dot"></span>
          {estadoTexto[estado]}
        </span>

        {mesa.mesero && (
          <small>{mesa.mesero.nombre}</small>
        )}
      </div>
    </button>
  );
}