import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import multer, { FileFilterCallback } from 'multer'
import { Request } from 'express'

dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME!,
  api_key: process.env.CLOUDINARY_KEY!,
  api_secret: process.env.CLOUDINARY_SECRET!
})

const allowedMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'application/zip',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req: Request, file: Express.Multer.File) => {
    return {
      folder: 'Home',
      resource_type: 'auto',
      public_id: `${file.fieldname}-${Date.now()}`,
      chunk_size: 6000000
    }
  }
})

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true)
  } else if (file.size > 6000000) {
    cb(new Error('File too large, maximum size is 6MB'))
  } else {
    cb(new Error('File type not allowed'))
  }
}

const uploadCloud = multer({
  storage,
  fileFilter
})

export default uploadCloud
