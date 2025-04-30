// Basic Express server for handling GPT and webhook routes
const express = require('express');
const app = express();
app.use(express.json());

app.post('/api/gpt', (req, res) => {
  res.send({ message: 'GPT endpoint placeholder' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
