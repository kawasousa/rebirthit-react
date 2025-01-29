import './style.css'
import { useState } from "react";
import { Link } from 'react-router-dom';
import RoundContainer from '../../components/RoundContainer'
import LogoContainer from "../../components/LogoContainer";

function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  function handleSignUp() {
    logginUser(username, password);
  }

  return (
    <div className="main-container">
      <LogoContainer />
      <h2>Cadastre-se</h2>
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
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </RoundContainer>
        <RoundContainer>
          <button onClick={handleSignUp}>SignUp</button>
        </RoundContainer>
      </form>
      <Link to={"/auth/login"}>Já tem uma conta? Faça login!</Link>
    </div>
  );
};

export default SignUp;
