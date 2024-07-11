
import { db } from "./db";
import { documentTable, metadataTable } from "./schema";

async function seed() {
    await db.transaction(async (tx) => {
        await tx.insert(documentTable).values({
            id: 'document-id',
            status: 'PROCESSED',
            updatedAt: new Date().toISOString(),
            uploadedAt: new Date().toISOString(),
        });
        await tx.insert(metadataTable).values({
            name: 'document-name',
            author: 'document-author',
            kind: 'ISO norm',
            documentId: 'document-id',
        });
    });
}

seed().then(() => {
    console.log('Seed completed');
    process.exit(0);
}).catch((error) => {
    console.error('Seed failed', error);
    process.exit(1);
});