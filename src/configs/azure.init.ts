/* eslint-disable @typescript-eslint/no-explicit-any */
import multer from 'multer'
import { BlobSASPermissions, BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob'
import ErrorResponse from '~/core/error.response'
import { StatusCodes } from 'http-status-codes'
import ERROR_MESSAGES from '~/core/error-message'
import { Request } from 'express'
const storage = multer.memoryStorage()
export const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING!
export const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME!

export const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING)
export const containerClient = blobServiceClient.getContainerClient(containerName)
const AZURE_STORAGE_ACCOUNT_NAME = process.env.AZURE_STORAGE_ACCOUNT_NAME!
const AZURE_STORAGE_ACCOUNT_KEY = process.env.AZURE_STORAGE_ACCOUNT_KEY!

export const sharedKeyCredential = new StorageSharedKeyCredential(AZURE_STORAGE_ACCOUNT_NAME, AZURE_STORAGE_ACCOUNT_KEY)

const imageFileFilter = (req: Request, file: Express.Multer.File, callback: multer.FileFilterCallback) => {
  if (!file.mimetype.startsWith('image/')) {
    const error = new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.INVALID_FILE_TYPE)
    return callback(error as any, false)
  }
  callback(null, true)
}

export const uploadManyFile = multer({
  storage: storage,
  limits: {
    fileSize: 40 * 1024 * 1024,
    files: 5
  }
}).array('files', 5)

export const uploadSingleFile = multer({
  storage: storage,
  limits: {
    fileSize: 40 * 1024 * 1024
  },
  fileFilter: imageFileFilter
}).single('file')

export const uploadFileToAzure = async (file: Express.Multer.File) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const blobName = `${timestamp}_${file.originalname}`

  const blockBlobClient = containerClient.getBlockBlobClient(blobName)

  await blockBlobClient.uploadData(file.buffer, {
    blobHTTPHeaders: { blobContentType: file.mimetype }
  })

  const expiresOn = new Date()
  expiresOn.setFullYear(expiresOn.getFullYear() + 1)

  const sasToken = await blockBlobClient.generateSasUrl({
    permissions: BlobSASPermissions.parse('r'),
    expiresOn
  })

  return sasToken
}

export const deleteFileFromAzure = async (fileName: string) => {
  const containerClient = blobServiceClient.getContainerClient(containerName)
  const blockBlobClient = containerClient.getBlockBlobClient(fileName)
  await blockBlobClient.deleteIfExists()
}
