import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard(){
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(()=>{
    const token = localStorage.getItem('token');
    if(!token) { navigate('/login'); return; }
    axios.get('/api/auth/user', { headers: { Authorization: 'Bearer ' + token }})
      .then(res => setUser(res.data))
      .catch(()=> navigate('/login'));
  },[]);

  return (
    <div>
      <h2>Tableau de bord</h2>
      {user ? (
        <div>
          <p>Bonjour, {user.name} ({user.role})</p>
          <p>Crédits : {user.credits}</p>
        </div>
      ) : <div>Chargement...</div>}
    </div>
  );
}
