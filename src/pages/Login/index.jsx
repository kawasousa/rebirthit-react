  import './style.css'
  import AngelIcon from '../../assets/icons/angel-icon.svg'
  import { useState } from "react";
  import { Link, useNavigate } from 'react-router-dom';
  import { logginUser } from "../../services/authService";
  import RoundContainer from '../../components/RoundContainer'
  import LogoContainer from "../../components/LogoContainer";

  function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    function handleLogin(event) {
      event.preventDefault();
      logginUser(email, password, navigate);
    }

    return (
      <div className="main-container">
        <LogoContainer/>
        <h2>Entre na sua conta</h2>
        <form>
          <RoundContainer>
            <input
              type="text"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </RoundContainer>
          <RoundContainer>
            <input
              type="text"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </RoundContainer>
          <RoundContainer>
            <button onClick={handleLogin}>Login</button>
          </RoundContainer>
        </form>
        <Link to={"/signup"}>Crie uma conta!</Link>
      </div>
    );
  };

  export default Login;
