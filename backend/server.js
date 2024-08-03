require('dotenv').config();

const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const cors = require('cors');
app.use(cors()); 

const locationRoutes = require('./routes/locations.js');
const userRoutes = require('./routes/users.js');

app.use(express.json());

const staticPath = path.join(__dirname,'..', 'frontend');
app.use(express.static(staticPath));


app.use('/locations', locationRoutes);
app.use('/users', userRoutes);

app.get('*', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
  });

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
