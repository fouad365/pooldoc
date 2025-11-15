import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [err,setErr] = useState(null);
  const navigate = useNavigate();

  async function submit(e){
    e.preventDefault();
    try{
      const res = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    }catch(err){
      setErr(err?.response?.data?.error || 'Erreur');
    }
  }

  return (
    <div className="card">
      <h2>Connexion</h2>
      {err && <div className="error">{err}</div>}
      <form onSubmit={submit}>
        <label>Email<input value={email} onChange={e=>setEmail(e.target.value)} required/></label>
        <label>Mot de passe<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></label>
        <button className="btn" type="submit">Se connecter</button>
      </form>
    </div>
  );
}
