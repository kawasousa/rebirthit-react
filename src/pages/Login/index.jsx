  import './style.css'
  import { useState } from "react";
  import { Link, useNavigate } from 'react-router-dom';
  import { logginUser } from "../../services/authService";
  import RoundContainer from '../../components/RoundContainer'
  import LogoContainer from "../../components/LogoContainer";

  function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    function handleLogin() {
      logginUser(username, password, navigate);
    }

    return (
      <div className="main-container">
        <LogoContainer/>
        <h2>Entre na sua conta</h2>
        <form>
          <RoundContainer>
            <input
              type="text"
              placeholder="Username"
              
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </RoundContainer>
          <RoundContainer>
            <input
              type="text"
              placeholder="Password"
              
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </RoundContainer>
          <RoundContainer>
            <button onClick={handleLogin}>Login</button>
          </RoundContainer>
        </form>
        <Link to={"/auth/signup"}>Crie uma conta!</Link>
      </div>
    );
  };

  export default Login;
