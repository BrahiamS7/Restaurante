import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(usuario, password);

      localStorage.setItem("authenticated", "true");

      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-logo">
          R
        </div>

        <h1>Bienvenido</h1>
        <p>Ingresa al sistema del restaurante</p>

        <form onSubmit={handleSubmit}>

          <label>Usuario</label>

          <input
            type="text"
            value={usuario}
            onChange={(event) => setUsuario(event.target.value)}
            placeholder="Ingresa tu usuario"
            required
          />

          <label>Contraseña</label>

          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Ingresa tu contraseña"
            required
          />

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>

        </form>
      </div>
    </div>
  );
}