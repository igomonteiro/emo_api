import app from './app';
import https from 'https';
import fs from 'fs';

const PORT = process.env.PORT || 3000;

const key = fs.readFileSync('./certs/localhost-key.pem');
const cert = fs.readFileSync('./certs/localhost.pem');

const server =  https.createServer({ key: key, cert: cert }, app);
server.listen(PORT, () => {
  console.log(`App listening on port:  ${PORT}`);
});