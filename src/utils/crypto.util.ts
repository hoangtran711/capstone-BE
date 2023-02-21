import * as CryptoJS from 'crypto-js';

const secretPass = 'KoOn711286';

export const encryptData = (data: any) => {
  const dataEncrypted = CryptoJS.AES.encrypt(
    JSON.stringify(JSON.stringify(data)),
    secretPass,
  ).toString();
  return dataEncrypted;
};

export const decryptData = (data: string) => {
  const bytes = CryptoJS.AES.decrypt(data, secretPass);
  const dataDecrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return dataDecrypted;
};
