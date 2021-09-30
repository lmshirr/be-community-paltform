const app = require('./app');

const { PORT } = process.env;

app.listen(PORT || 5000, () =>
  console.log(`This App is Running on port ${PORT}`)
);
