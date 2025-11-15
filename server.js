const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const calcRoutes = require('./routes/calc');
const historyRoutes = require('./routes/history');
const creditsRoutes = require('./routes/credits');
const companyRoutes = require('./routes/company');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/calc', calcRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/credits', creditsRoutes);
app.use('/api/company', companyRoutes);

app.get('/api/health', (req,res)=>res.json({status:'ok'}));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
