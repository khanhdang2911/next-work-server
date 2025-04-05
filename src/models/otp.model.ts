import mongoose, { Schema } from 'mongoose'

const COLLECTION_NAME = 'otp_logs'
const DOCUMENT_NAME = 'otp_log'

interface IOtpLog {
  otp_token: string
  otp_email: string
  expired_at: Date
}

const OtpLogSchema = new Schema<IOtpLog>(
  {
    otp_token: {
      type: String,
      required: true,
      unique: true
    },
    otp_email: {
      type: String,
      required: true,
      unique: true
    },
    expired_at: {
      type: Date,
      required: true,
      expires: 180
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

const OtpLog = mongoose.model<IOtpLog>(DOCUMENT_NAME, OtpLogSchema)
OtpLogSchema.index({ members: 1 })
export { OtpLog, IOtpLog }
