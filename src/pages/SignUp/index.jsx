import './style.css'
import '../../assets/icons/profile-icons'
import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import RoundContainer from '../../components/RoundContainer'
import LogoContainer from "../../components/LogoContainer";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createProfile } from '../../services/authService'

function SignUp() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const profileIcons = ["user-astronaut", "mug-saucer", "user-graduate", "user-ninja"];
  const [selectedIcon, setSelectedIcon] = useState(null);

  function handleSignUp(event) {
    event.preventDefault();
    if (selectedIcon && username && email && password && name) {
      createProfile(navigate, username, email, password, name, selectedIcon);
    }
  }

  return (
    <div className="main-container">
      <LogoContainer />
      <h2>{`Boas vindas${!name ? '!' : ', ' + name + '!'}`}</h2>
      <form>
        <RoundContainer>
          <input
            type="text"
            placeholder="Username"
            value={username}
            required
            onChange={(e) => setUsername(e.target.value)}
          />
        </RoundContainer>
        <RoundContainer>
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </RoundContainer>
        <RoundContainer>
          <input
            type="text"
            placeholder="Senha"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </RoundContainer>
        <RoundContainer>
          <input
            type="text"
            placeholder="Seu nome"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          />
        </RoundContainer>
        <p>seu ícone</p>
        <RoundContainer extraClasses={"icons-container"} >
          {
            profileIcons.map((icon, index) => {
              return (
                <button key={index} type='button'
                  className={`selected-icon ${selectedIcon === icon ? 'active' : ''}`}
                  onClick={() => setSelectedIcon(icon)}
                >
                  <FontAwesomeIcon icon={icon} size='2x' />
                </button>
              )
            })
          }
        </RoundContainer>
        <button className='submit-button' onClick={handleSignUp}>
          SignUp
        </button>
      </form>
      <Link to={"/"}>Já tem uma conta? Faça login!</Link>
    </div>
  );
};

export default SignUp;
