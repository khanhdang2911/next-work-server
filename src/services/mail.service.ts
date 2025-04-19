import dotenv from 'dotenv'
import { OtpLog } from '~/models/otp.model'
import sendMailVerifyTemplate from '~/utils/mail-verify.template'
import transporter from '~/configs/mailer.init'
import ErrorResponse from '~/core/error.response'
import ERROR_MESSAGES from '~/core/error-message'
import { StatusCodes } from 'http-status-codes'
import { User } from '~/models/user.model'
import { generateToken } from './auth.service'
import randtoken from 'rand-token'
import bcrypt from 'bcrypt'
dotenv.config()
const newOtp = async (email: string) => {
  const otpToken = randtoken.generate(Number(process.env.OTP_TOKEN_SIZE) || 64)
  const hashToken = bcrypt.hashSync(otpToken, Number(process.env.OTP_SALT_ROUNDS) || 10)
  await OtpLog.create({
    otp_email: email,
    otp_token: hashToken,
    expired_at: new Date(Date.now() + 3 * 60 * 1000)
  })
  return otpToken
}

const sendMailVerification = async (email: string) => {
  try {
    const otp = await newOtp(email)
    const verificationLink = `${process.env.VERIFICATION_LINK}/${otp}/${email}`
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: 'Verify Your Email',
      html: sendMailVerifyTemplate(email, verificationLink)
    }
    return transporter.sendMail(mailOptions)
  } catch (e) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.CHECK_EMAIL)
  }
}

const verifyAccount = async (otpToken: string, email: string) => {
  const otp = await OtpLog.findOne({ otp_email: email }).lean()
  if (!otp) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.INVALID_OTP)
  }
  const isValid = await bcrypt.compare(otpToken, otp.otp_token)
  await OtpLog.deleteOne({ otp_email: email })
  if (!isValid) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.INVALID_OTP)
  }
  const user = await User.findOneAndUpdate({ email }, { isActivated: true }, { new: true })
  if (!user) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.USER_NOT_FOUND)
  }
  const accessToken = generateToken({
    id: user._id,
    email: user.email,
    name: user.name
  })
  const refreshToken = randtoken.generate(Number(process.env.JWT_REFRESH_TOKEN_SIZE) || 64)
  user.refreshToken = refreshToken
  await user.save()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userWithoutPassword } = user.toObject()

  return { ...userWithoutPassword, accessToken }
}

export { sendMailVerification, verifyAccount }
