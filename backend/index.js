const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Middleware to enable CORS
app.use(cors());

// Middleware to parse request body as JSON
app.use(express.json());

// POST endpoint to save score data to JSON file
app.post('/leaderboard', (req, res) => {
  // Read existing data from file (if any)
  let data = [];
  try {
    const fileContents = fs.readFileSync('./leaderboard.json', 'utf8');
    data = JSON.parse(fileContents);
  } catch (err) {
    console.error(err);
  }

  // Add new score data from request body to array
  data.push({
    player: req.body.player,
    score: req.body.score,
  });

  // Write updated data to file
  fs.writeFileSync('./leaderboard.json', JSON.stringify(data));

  // Send response
  res.status(201).send('Score data saved!');
});

// GET endpoint to retrieve top 10 score data from JSON file
app.get('/leaderboard', (req, res) => {
  // Read data from file
  let data = [];
  try {
    const fileContents = fs.readFileSync('./leaderboard.json', 'utf8');
    data = JSON.parse(fileContents);
  } catch (err) {
    console.error(err);
  }

  // Sort data in descending order by score
  data.sort((a, b) => b.score - a.score);

  // Send top 10 scores as JSON response
  const topTen = data.slice(0, 10);
  res.json(topTen);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});