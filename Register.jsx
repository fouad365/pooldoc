import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register(){
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [role,setRole] = useState('client');
  const [err,setErr] = useState(null);
  const navigate = useNavigate();

  async function submit(e){
    e.preventDefault();
    try{
      await axios.post('/api/auth/register', { name, email, password, role });
      navigate('/login');
    }catch(err){
      setErr(err?.response?.data?.error || 'Erreur');
    }
  }

  return (
    <div className="card">
      <h2>Inscription</h2>
      {err && <div className="error">{err}</div>}
      <form onSubmit={submit}>
        <label>Nom<input value={name} onChange={e=>setName(e.target.value)} required/></label>
        <label>Email<input value={email} onChange={e=>setEmail(e.target.value)} required/></label>
        <label>Mot de passe<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></label>
        <label>Rôle
          <select value={role} onChange={e=>setRole(e.target.value)}>
            <option value="client">Client</option>
            <option value="enterprise">Entreprise</option>
          </select>
        </label>
        <button className="btn" type="submit">S'inscrire</button>
      </form>
    </div>
  );
}
