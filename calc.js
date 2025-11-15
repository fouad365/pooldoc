const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');

const router = express.Router();

function getUserIdFromToken(req) {
  const auth = req.headers.authorization;
  if (!auth) return null;
  const token = auth.split(' ')[1];
  try {
    const data = require('jsonwebtoken').verify(token, process.env.JWT_SECRET || 'dev_secret');
    return data.id;
  } catch (e) { return null; }
}

router.post('/run', (req, res) => {
  const input = req.body;
  if (!input.volume) return res.status(400).json({ error: 'volume required' });

  const checks = [];

  const pH = parseFloat(input.pH);
  if (!isNaN(pH)) {
    if (pH < 7.2) checks.push({ param: 'pH', value: pH, status: 'low', action: 'Ajouter un produit alcalinisant (pH+) selon le volume.'});
    else if (pH > 7.6) checks.push({ param: 'pH', value: pH, status: 'high', action: 'Ajouter un produit acidifiant (pH-) selon le volume.'});
    else checks.push({ param: 'pH', value: pH, status: 'ok', action: 'pH dans la plage idéale (7.2-7.6).' });
  }

  const TAC = parseFloat(input.TAC);
  if (!isNaN(TAC)) {
    if (TAC < 80) checks.push({ param: 'TAC', value: TAC, status: 'low', action: 'Augmenter la TAC avec un produit tampon ou bicarbonate.'});
    else if (TAC > 120) checks.push({ param: 'TAC', value: TAC, status: 'high', action: 'Diluer ou corriger progressivement la TAC.'});
    else checks.push({ param: 'TAC', value: TAC, status: 'ok', action: 'TAC dans la plage idéale (80-120 ppm).' });
  }

  const TH = parseFloat(input.TH);
  if (!isNaN(TH)) {
    if (TH < 100) checks.push({ param: 'TH', value: TH, status: 'low', action: 'Ajouter un durcisseur ou sel minéral pour augmenter la dureté.'});
    else if (TH > 250) checks.push({ param: 'TH', value: TH, status: 'high', action: 'Traiter le calcaire (adoucisseur, inhibiteur de tartre).'});
    else checks.push({ param: 'TH', value: TH, status: 'ok', action: 'TH dans la plage idéale (100-250 ppm).' });
  }

  const chl = parseFloat(input.chlore);
  if (!isNaN(chl)) {
    if (chl < 1) checks.push({ param: 'Chlore libre', value: chl, status: 'low', action: 'Ajouter du chlore (chlore choc si très bas).'});
    else if (chl > 3) checks.push({ param: 'Chlore libre', value: chl, status: 'high', action: 'Laisser descendre, éviter baignade jusqu\'à la normalisation.'});
    else checks.push({ param: 'Chlore libre', value: chl, status: 'ok', action: 'Chlore dans la plage idéale (1-3 ppm).' });
  }

  const cya = parseFloat(input.CYA);
  if (!isNaN(cya)) {
    if (cya < 30) checks.push({ param: 'CYA', value: cya, status: 'low', action: 'Ajouter stabilisant (acide cyanurique) si utilisation de chlore libre.'});
    else if (cya > 50) checks.push({ param: 'CYA', value: cya, status: 'high', action: 'Diluer l\'eau; CYA trop élevé réduit l\'efficacité du chlore.'});
    else checks.push({ param: 'CYA', value: cya, status: 'ok', action: 'CYA dans la plage idéale (30-50 ppm).' });
  }

  const brome = parseFloat(input.brome);
  if (!isNaN(brome)) {
    if (brome < 3) checks.push({ param: 'Brome', value: brome, status: 'low', action: 'Ajouter du brome.'});
    else if (brome > 5) checks.push({ param: 'Brome', value: brome, status: 'high', action: 'Réduire dosage; vérifier filtration.'});
    else checks.push({ param: 'Brome', value: brome, status: 'ok', action: 'Brome dans la plage idéale (3-5 ppm).' });
  }

  const sal = parseFloat(input.salinite);
  if (!isNaN(sal)) {
    if (sal < 4) checks.push({ param: 'Salinité', value: sal, status: 'low', action: 'Ajouter du sel jusqu\'à la valeur cible.'});
    else if (sal > 6) checks.push({ param: 'Salinité', value: sal, status: 'high', action: 'Diluer l\'eau.'});
    else checks.push({ param: 'Salinité', value: sal, status: 'ok', action: 'Salinité dans la plage idéale (4-6 g/L).' });
  }

  const fer = parseFloat(input.fer);
  if (!isNaN(fer)) {
    if (fer >= 0.1) checks.push({ param: 'Fer', value: fer, status: 'high', action: 'Traitement de déferisation (séquestrant ou filtration).'});
    else checks.push({ param: 'Fer', value: fer, status: 'ok', action: 'Fer < 0.1 ppm.'});
  }

  const temp = parseFloat(input.temperature);
  if (!isNaN(temp)) {
    if (temp < 24) checks.push({ param: 'Température', value: temp, status: 'low', action: 'Température basse; ajuster si besoin.'});
    else if (temp > 28) checks.push({ param: 'Température', value: temp, status: 'high', action: 'Température élevée; surveiller consommation chimique.'});
    else checks.push({ param: 'Température', value: temp, status: 'ok', action: 'Température normale (24-28°C).'});
  }

  const result = { checks, summary: `${checks.length} checks performed.` };

  const userId = getUserIdFromToken(req);
  if (userId) {
    const id = uuidv4();
    db.prepare('INSERT INTO history (id,user_id,created_at,data,result) VALUES (?,?,?,?,?)')
      .run(id, userId, Date.now(), JSON.stringify(input), JSON.stringify(result));
  }

  res.json({ result });
});

module.exports = router;
