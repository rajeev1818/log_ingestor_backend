const Pool = require('pg').Pool;
const { CON_STR } = process.env;


const pool = new Pool({
  connectionString: CON_STR,
});


pool.connect((err, client, done) => {
  if (err) {
    console.error('Error connecting to the database', err);
  } else {
    console.log('Connected to the database');
  }
});


module.exports = pool;






