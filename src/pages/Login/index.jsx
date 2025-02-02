import './style.css'
import AngelIcon from '../../assets/icons/angel-icon.svg'
import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { logginUser } from "../../services/authService";
import LogoContainer from "../../components/LogoContainer";
import PopUp from '../../components/PopUp'

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function handleLogin(event) {
    event.preventDefault();
    if (username && password)
      logginUser(username, password, navigate);
    else setPopUps(prevPopUps => [...prevPopUps, 'Preencha todos os campos antes de prosseguir'])
  }

  function handleUsernameChange(e) {
    const value = e.target.value;
    if (/^[a-z0-9._]*$/.test(value)) {
      setUsername(value);
    }
  }

  const [popUps, setPopUps] = useState([]);
  function removePopUp(index) {
    setPopUps(prevPopUps => prevPopUps.filter((_, i) => i !== index));
  }

  return (
    <div className="main-container">
      <LogoContainer />
      <div>
        {popUps.map((message, index) => (
          <PopUp key={index} message={message} onClose={() => removePopUp(index)} />
        ))
        }
      </div>
      <h2>Entre na sua conta</h2>
      <form>
        <input
          type="text"
          placeholder="Seu nome de usuário"
          required
          value={username}
          onChange={handleUsernameChange}
        />
        <input
          type="password"
          placeholder="Sua senha"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </form>
      <p>
        Não tem uma conta? <Link to={"/signup"} className='link-text'>Crie uma agora!</Link>
      </p>
    </div>
  );
};

export default Login;
