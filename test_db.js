const { Client } = require('pg');
const client = new Client({
  connectionString: "postgresql://postgres:postgres@127.0.0.1:51216/postgres?sslmode=disable"
});

client.connect()
  .then(() => {
    console.log('Successfully connected to the database!');
    return client.query('SELECT NOW()');
  })
  .then(res => {
    console.log('Current Time:', res.rows[0]);
    client.end();
  })
  .catch(err => {
    console.error('Connection error:', err.stack);
    process.exit(1);
  });
