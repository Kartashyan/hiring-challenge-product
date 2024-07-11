
import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const documentTable = sqliteTable('document', {
    id: text('id').primaryKey(),
    status: text('status').default('initial').notNull(),
    updatedAt: text('created_at').default('CURRENT_TIMESTAMP').notNull(),
    uploadedAt: text('uploaded_at').default('CURRENT_TIMESTAMP').notNull(),
    filePath: text('file_path'),
});

export const metadataTable = sqliteTable('metadata', {
    name: text('name'),
    author: text('author'),
    kind: text('kind').notNull().default('ISO norm'),
    documentId: text('document_id').references(() => documentTable.id, { onDelete: 'cascade' }),
});


export const documentTableRelations = relations(documentTable, ({ one }) => {
    return {
        metadata: one(metadataTable)
    }
});

export const metadataTableRelations = relations(metadataTable, ({ one }) => {
    return {
        document: one(documentTable, {
            fields: [metadataTable.documentId],
            references: [documentTable.id],
        })
    }
});

export type DocumentTableType = typeof documentTable.$inferSelect;
export type MetadataTableType = typeof metadataTable.$inferSelect;

export interface DocumentDBModel extends DocumentTableType {
    metadata: MetadataTableType | null;
}
