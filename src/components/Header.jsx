import './Header.css'

export default function Header() {
  return (
    <header className="app-header">
      <div className="logo-container">
        <div className="logo-item cecyte">
          <img src="/logos/cecyte.png" alt="CECyTE Michoacán" />
        </div>
        <div className="logo-item sep">
          <img src="/logos/sep.png" alt="Secretaría de Educación Pública" />
        </div>
        <div className="logo-item michoacan">
          <img src="/logos/michoacan.png" alt="Michoacán" />
        </div>
      </div>
    </header>
  )
}
