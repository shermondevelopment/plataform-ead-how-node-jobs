const express = require('express');

const app = express();
const cors = require('cors');
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/files', express.static(path.resolve(__dirname, 'tmp', 'profile')));
app.use(cors());

app.get('/', async (req, res) => {
    res.status(200).json({ app: 'running' });
});

require('./app/controllers')(app);

app.listen(process.env.PORT || 3004, () => console.log('🔥🔥 app running'));
