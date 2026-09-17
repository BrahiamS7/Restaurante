export default function ConfirmModal({ titulo, mensaje, onConfirmar, onCancelar }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={onCancelar}>×</button>

        <div className="modal-icon">?</div>

        <h2>{titulo}</h2>
        <p>{mensaje}</p>

        <div style={{ display: "flex", gap: "10px" }}>
          <button className="secondary-button" onClick={onCancelar} style={{ flex: 1 }}>
            Cancelar
          </button>
          <button className="primary-button" onClick={onConfirmar} style={{ flex: 1 }}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}