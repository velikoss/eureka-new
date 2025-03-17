import jwt from 'jsonwebtoken';

// Define a secret key for signing the JWT
const SECRET_KEY = 'your-secret-key'; // Replace with a strong secret key in production

// Function to encode (create) a JWT
export function encodeJWT(payload: string): string {
  try {
    // Sign the payload with the secret key and set an expiration time
    const token = jwt.sign(payload, SECRET_KEY);
    return token;
  } catch (error) {
    console.error('Error encoding JWT:', error);
    throw new Error('Failed to encode JWT');
  }
}

// Function to decode (verify) a JWT
export function decodeJWT(token: string): string | null {
  try {
    // Verify the token and decode the payload
    const decoded = jwt.verify(token, SECRET_KEY) as string;
    return decoded;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null; // Return null if the token is invalid or expired
  }
}
