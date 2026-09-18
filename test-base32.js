const OTPAuth = require('otpauth');
try {
  const secret = 'UIWQVINWMQHKT5JOR65D4ECU24';
  const s = OTPAuth.Secret.fromBase32(secret);
  console.log("Success:", s);
} catch (e) {
  console.error("Error:", e.message);
}
