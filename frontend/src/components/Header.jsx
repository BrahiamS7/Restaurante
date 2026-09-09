export default function Header({ title, subtitle }) {
  return (
    <header className="header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>

      <div className="header-user">
        <div className="user-avatar">A</div>

        <div>
          <strong>Administrador</strong>
          <span>Administrador</span>
        </div>
      </div>
    </header>
  );
}