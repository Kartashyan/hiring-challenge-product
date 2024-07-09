import express from 'express';
import { documentRouter } from './pdf-document/infrastructure/document.controller';

const app = express();

app.use(express.json());
app.use('/document', documentRouter);

console.log('Listening on port 3000');
app.listen(3000);
