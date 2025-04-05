import { auth } from 'express-oauth2-jwt-bearer'
import dotenv from 'dotenv'
dotenv.config()

const auth0Middleware = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER,
  tokenSigningAlg: 'RS256'
})

export default auth0Middleware
