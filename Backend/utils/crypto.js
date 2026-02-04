import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';

export function encrypt(text) {
    const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
    const IV = process.env.ENCRYPTION_IV;
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), IV);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
}

export function decrypt(text) {
    const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
    const IV = process.env.ENCRYPTION_IV;
  const encryptedText = Buffer.from(text, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), IV);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}