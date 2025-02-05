import './style.css'
import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from "../../services/authService";
import { usePopUps } from '../../hooks/UsePopUps'
import LogoContainer from "../../components/LogoContainer";
import PopUp from '../../components/PopUp'

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { popUps, addPopUp, removePopUp } = usePopUps();

  async function handleLogin(event) {
    event.preventDefault();

    if (username && password) {
      addPopUp('Fazendo login...');

      try {
        const userData = await loginUser(username, password);
        addPopUp('Login feito com sucesso');

        if (userData) navigate("/");

      } catch (error) {
        addPopUp('Falha no login: ' + (error.message));
      }
    }
    else addPopUp('Preencha todos os campos antes de prosseguir');
  }

  function handleUsernameChange(e) {
    const value = e.target.value.toLowerCase();

    if (/^[a-z0-9._]*$/.test(value)) {
      setUsername(value);
    }
    else addPopUp('Nomes de usuário devem ter apenas letras, números ou _')
  }

  return (
    <div className="main-container">
      <LogoContainer />
      <div>
        {popUps.map((message, index) => (<PopUp key={index} message={message} onClose={() => removePopUp(index)} />))}
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
      
      {(window.matchMedia("(max-width: 1625px)").matches) ?
        <div >
          <p style={{color: "#9f72ff"}}> RebirthIt foi projetado telas maiores! </p>
          
        </div>
        : null
      }
    </div>
  );
};

export default Login;
