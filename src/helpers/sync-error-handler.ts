import { Request, Response, NextFunction } from 'express'
const syncErrorHandler = (middleware: (req: Request, res: Response, next: NextFunction) => void) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      middleware(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}

export default syncErrorHandler
