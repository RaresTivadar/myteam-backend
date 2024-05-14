const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes'); 
const teamRoutes = require('./routes/teamRoutes'); 
const sessionRoutes = require('./routes/sessionRoutes');
const eventRoutes = require('./routes/eventRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const statisticsRoutes = require('./routes/statisticsRoutes');


const app = express();

app.use(express.json()); 

mongoose.connect('mongodb://localhost:27017/myTeamDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB...', err));

app.use('/api/users', userRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/statistics', statisticsRoutes);

const PORT = process.env.PORT || 3107;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
