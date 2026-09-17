import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={
        theme === "dark"
          ? "Cambiar a modo claro"
          : "Cambiar a modo oscuro"
      }
      title={
        theme === "dark"
          ? "Cambiar a modo claro"
          : "Cambiar a modo oscuro"
      }
    >
      {theme === "dark" ? "☀" : "☾"}
    </button>
  );
}