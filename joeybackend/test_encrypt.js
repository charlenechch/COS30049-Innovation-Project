const { encrypt, decrypt } = require('./utils/crypto');

const testCases = [
    "Name: Sarah Lim | IC: 900123-10-5678 | Email: sarah.lim@parkmail.com | Address: 23 Rainforest Lane, Sarawak",
    "Guide PG102 received a 4.8 rating and positive feedback for handling a group with 3 elderly visitors in steep terrain.",
    "Training Completed: Endangered Species Protection | Date: 2025-03-15 | Status: Certified",
    "Visitor Comment: 'Guide PG105 was very helpful and even assisted a child who got separated. Very attentive!'",
    "Species: Rafflesia arnoldii | GPS: 3.721, 101.654 | Spotted by: PG110 | Time: 2025-04-01 08:45",
    "AI Flagged: Probable illegal poaching activity based on movement pattern near Zone E | Risk Level: HIGH",
    "Sensor: Trap Cam A23 | Motion detected at 02:33 AM | Location: Zone B – Animal Path 2",
    "Admin Note: PG108 late for 2 consecutive shifts – advised to submit a written explanation.",
    `Observation Log:
    Species: Malayan Tiger
    Guide: PG112
    Behavior: Aggressive posture followed by retreat into tall grass.
    Time: 2025-04-02 16:10
    Weather: Cloudy`,
    '{"id":"PG113","score":89,"tags":["alert","active"],"notes":"Top performer this month."}'
  ];

let successCount = 0;

testCases.forEach((data, index) => {
  const encrypted = encrypt(data);
  const decrypted = decrypt(encrypted);
  const success = decrypted === data;
  console.log(`Test ${index + 1}: ${success ? 'Passed\n' : 'Failed\n'} | Original: "${data}"\n | Decrypted: "${decrypted}"\n`);
  if (success) successCount++;
});

console.log(`\n✅ Success Rate: ${(successCount / testCases.length) * 100}%`);
console.log(encrypt("Sherman Tan"));