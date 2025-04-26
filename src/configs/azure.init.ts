import multer from 'multer'
import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob'
const storage = multer.memoryStorage()
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 40 * 1024 * 1024,
    files: 5
  }
}).array('files', 5)

export const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING!
export const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME!

export const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING)
export const containerClient = blobServiceClient.getContainerClient(containerName)
const AZURE_STORAGE_ACCOUNT_NAME = process.env.AZURE_STORAGE_ACCOUNT_NAME!
const AZURE_STORAGE_ACCOUNT_KEY = process.env.AZURE_STORAGE_ACCOUNT_KEY!

export const sharedKeyCredential = new StorageSharedKeyCredential(AZURE_STORAGE_ACCOUNT_NAME, AZURE_STORAGE_ACCOUNT_KEY)
