import { Router, Request, Response } from 'express';
import { DocumentService } from '../application/document.service';
import { MetadataDto, UploadDocumentDto } from '../application/document.dto';
import * as fs from 'fs';
import * as path from 'path';
import { LocalFileStorage } from './file-storage-repository.adapter';
import { InMemoryAdapter } from './document-repository.adapter';
import { MockProcessingAPI } from './processing-api.mock';

const storagePath = 'uploads/';
const fileStorage = new LocalFileStorage(storagePath);
const documentRepository = new InMemoryAdapter(fileStorage);
const processingApi = new MockProcessingAPI();
const documentService = new DocumentService(documentRepository, processingApi);

export const documentRouter = Router();

const handleFileUpload = async (req: Request): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk) => {
      chunks.push(chunk);
    });
    req.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
    req.on('error', (err) => {
      reject(err);
    });
  });
};

// GET /document/pending - Returns a list of pending documents.
documentRouter.get('/pending', async (req: Request, res: Response) => {
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
  console.log("req.params.id", req.params.id);
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
documentRouter.post('/upload', async (req: Request, res: Response) => {
  try {
      const fileBuffer = await handleFileUpload(req);
      const uploadDto: UploadDocumentDto = { file: fileBuffer };
      
      const result = await documentService.uploadDocument(uploadDto);

    if (!result.success) {
      return res.status(500).json({ message: result.reason });
    }
    return res.status(201).json({ message: 'Document uploaded' });
  } catch (error) {
    return res.status(500).json({ message: 'An error occurred while uploading the document.' });
  }
});

// POST /document/:id - Updates the document's metadata and triggers a call to the PROCESSING_API_ENDPOINT.
documentRouter.post('/:id', async (req: Request, res: Response) => {
  const metadataDto: MetadataDto = req.body;
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
