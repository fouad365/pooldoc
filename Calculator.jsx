import React, {useState} from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function Calculator(){
  const [form, setForm] = useState({
    volume:50, pH:'', TAC:'', TH:'', chlore:'', CYA:'', brome:'', salinite:'', fer:'', temperature:''
  });
  const [result, setResult] = useState(null);

  function change(e){ setForm({...form, [e.target.name]: e.target.value}); }

  async function run(e){
    e.preventDefault();
    try{
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: 'Bearer ' + token } : {};
      const res = await axios.post('/api/calc/run', form, { headers });
      setResult(res.data.result);
    }catch(err){
      alert(err?.response?.data?.error || 'Erreur');
    }
  }

  async function downloadPDF(){
    const el = document.getElementById('report');
    if(!el){ alert('Générer le rapport'); return; }
    const canvas = await html2canvas(el, { scale:2 });
    const img = canvas.toDataURL('image/png');
    const doc = new jsPDF('p','mm','a4');
    const width = doc.internal.pageSize.getWidth();
    const imgProps = doc.getImageProperties(img);
    const height = (imgProps.height * width) / imgProps.width;
    doc.addImage(img, 'PNG', 0, 0, width, height);
    doc.save('poolpro_report.pdf');
  }

  return (
    <div className="card">
      <h2>Calculateur piscine</h2>
      <form onSubmit={run} className="form-grid">
        <label>Volume (m³)<input name="volume" value={form.volume} onChange={change}/></label>
        <label>pH<input name="pH" value={form.pH} onChange={change}/></label>
        <label>TAC<input name="TAC" value={form.TAC} onChange={change}/></label>
        <label>TH<input name="TH" value={form.TH} onChange={change}/></label>
        <label>Chlore libre<input name="chlore" value={form.chlore} onChange={change}/></label>
        <label>CYA<input name="CYA" value={form.CYA} onChange={change}/></label>
        <label>Brome<input name="brome" value={form.brome} onChange={change}/></label>
        <label>Salinité<input name="salinite" value={form.salinite} onChange={change}/></label>
        <label>Fer<input name="fer" value={form.fer} onChange={change}/></label>
        <label>Température<input name="temperature" value={form.temperature} onChange={change}/></label>
        <div className="actions">
          <button className="btn" type="submit">Calculer</button>
          <button type="button" className="btn" onClick={downloadPDF}>Télécharger PDF</button>
        </div>
      </form>

      {result && (
        <div id="report" className="report">
          <h3>Rapport</h3>
          <p>{result.summary}</p>
          <ul>
            {result.checks.map((c,i)=>(
              <li key={i}><strong>{c.param}</strong>: {c.value} — {c.action}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
