import './style.css'
import '../../assets/icons/profile-icons'
import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import RoundContainer from '../../components/RoundContainer'
import LogoContainer from "../../components/LogoContainer";
import PopUp from '../../components/PopUp'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createProfile } from '../../services/authService'

function SignUp() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const profileIcons = ["user-astronaut", "mug-saucer", "user-graduate", "user-ninja"];
  const [selectedIcon, setSelectedIcon] = useState(null);

  function handleSignUp(event) {
    event.preventDefault();
    if (selectedIcon && username && password && name, selectedIcon) {
      createProfile(navigate, username, password, name, selectedIcon);
    }
    else setPopUps(prevPopUps => [...prevPopUps, 'Preencha todos os campos antes de prosseguir'])
  }

  function handleUsernameChange(e) {
    const value = e.target.value;
    e.target.value = 'a'
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
      <div>
        {popUps.map((message, index) => (
          <PopUp key={index} message={message} onClose={() => removePopUp(index)} />
        ))
        }
      </div>
      <LogoContainer />
      <h2>{`Boas vindas${!name ? '' : ', ' + name}`}!</h2>
      <form>
        <input
          type="text"
          placeholder="Seu nome único de usuário"
          value={username}
          autoFocus

          required
          onChange={handleUsernameChange}
        />
        <input
          type="text"
          placeholder="Seu apelido"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="password"
          placeholder="Sua senha"

          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <p>Escolha seu ícone</p>
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
      <p>
        Já tem uma conta? <Link className='link-text' to={"/login"}>Entre por aqui!</Link>
      </p>
    </div>
  );
};

export default SignUp;
