import { Request, Response, Router } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { MetadataModel, UploadDocumentDto } from '../application/document.dto';
import { DocumentService } from '../application/document.service';
import { SQLiteAdapter } from './document-repository.adapter';
import { LocalFileStorage } from './file-storage-repository.adapter';
import { MockProcessingAPI } from './processing-api.mock';
import multer from 'multer';

const storagePath = 'uploads/';
const fileStorage = new LocalFileStorage(storagePath);
const documentRepository = new SQLiteAdapter(fileStorage);
const processingApi = new MockProcessingAPI();
const documentService = new DocumentService(documentRepository, processingApi);

export const documentRouter = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, storagePath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Create multer upload instance
const upload = multer({ storage: storage });

// GET /document/pending - Returns a list of pending documents.
documentRouter.get('/pending-or-processing', async (req: Request, res: Response) => {
  const result = await documentService.getAllDocuments();
  if (!result.success) {
    return res.status(500).json({ message: result.reason });
  }
  return res.json(result.value);
});

// GET /document/pending - Returns a list of processed documents.
documentRouter.get('/processed', async (req: Request, res: Response) => {
  const result = await documentService.getAllDocuments();
  if (!result.success) {
    return res.status(500).json({ message: result.reason });
  }
  return res.json(result.value);
});


// GET /document/:id - Returns the document's metadata.
documentRouter.get('/:id', async (req: Request, res: Response) => {
  const result = await documentService.getMetadata(String(req.params.id));
  if (!result.success) {
    return res.status(404).json({ message: result.reason });
  }
  return res.json(result.value);
});

// GET /document/:id/resource - Returns the raw PDF resource.
documentRouter.get('/:id/resource', async (req: Request, res: Response) => {
  const result = await documentService.getFilePath(String(req.params.id));
  if (!result.success) {
    return res.status(404).json({ message: result.reason });
  }

  const filePath = result.value;
  if (!filePath) {
    return res.status(404).json({ message: 'Resource not found' });
  }
  res.setHeader('Content-Type', 'application/pdf');
  fs.createReadStream(path.join(storagePath, filePath)).pipe(res);
});

// POST /document/:id - Uploads a new document.
documentRouter.post('/upload', upload.array("pdfs"), async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[]

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    for(const file of files) {
      const uploadDto: UploadDocumentDto = { file: fs.readFileSync(file.path) };
      const result = await documentService.uploadDocument(uploadDto);
      if (!result.success) {
        return res.status(500).json({ message: result.reason });
      }
    }

    return res.status(201).json({ message: 'Documents uploaded' });
  } catch (error) {
    return res.status(500).json({ message: 'An error occurred while uploading the document.' });
  }
});

// POST /document/:id - Updates the document's metadata and triggers a call to the PROCESSING_API_ENDPOINT.
documentRouter.post('/:id', async (req: Request, res: Response) => {
  const metadataDto: MetadataModel = req.body;
  const result = await documentService.updateMetadata(String(req.params.id), metadataDto);
  if (!result.success) {
    return res.status(500).json({ message: result.reason });
  }
  return res.status(200).json({ message: 'Document metadata updated and processing started' });
});

// POST /document/:id/complete - Endpoint the processing API calls when the processing is complete.
documentRouter.post('/:id/complete', async (req: Request, res: Response) => {
  const result = await documentService.markAsProcessed(String(req.params.id));
  if (!result.success) {
    return res.status(500).json({ message: result.reason });
  }
  return res.status(200).json({ message: 'Document processing complete' });
});

// DELETE /document/:id - Deletes a document.
documentRouter.delete('/:id', async (req: Request, res: Response) => {
  const result = await documentService.deleteDocument(String(req.params.id));
  if (!result.success) {
    return res.status(500).json({ message: result.reason });
  }
  return res.status(200).json({ message: 'Document deleted' });
});
