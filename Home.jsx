import React from 'react';
import { Link } from 'react-router-dom';

export default function Home(){
  return (
    <div>
      <h1>Bienvenue sur PoolPro</h1>
      <p>Calculez les paramètres d'entretien de votre piscine et générez des rapports professionnels.</p>
      <div style={{marginTop:20}}>
        <Link to="/register" className="btn">Créer un compte</Link>
        <Link to="/calculator" className="btn btn-secondary" style={{marginLeft:10}}>Accéder au calculateur</Link>
      </div>
    </div>
  );
}
