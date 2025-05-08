const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'test_secret_key';

const sampleUser = {
  username: 'admin123',
  role: 'Admin'
};

const runTests = (n = 10) => {
  let under5s = 0;

  for (let i = 1; i <= n; i++) {
    const start = Date.now();
    const token = jwt.sign(sampleUser, JWT_SECRET, { expiresIn: '1h' });
    const end = Date.now();
    const timeTaken = end - start;

    console.log(`Test ${i}: ⏱️ Token issued in ${timeTaken} ms`);
    if (timeTaken <= 5000) under5s++;
  }

  const successRate = (under5s / n) * 100;
  console.log(`\n✅ Success Rate: ${successRate}%`);
};

runTests(10);
