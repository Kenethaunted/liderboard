import "./Header.css";
import "./reset.css";

export function Header() {
  return (
  <>
  <header>

    <div className="content">

      <div id="logo">
        <img src="tpu-logo-liderboard.svg" height="100%"/>
      </div>

      <div id="user">
        <span>ФИО</span>
        <img src="no-avatar.svg" height="100%" />
      </div>

    </div>
  
  </header>
  </>
  )
}