import { Request, Response, NextFunction } from 'express';
import { validateUUID } from './validation';

export function uuidParamMiddleware(paramName: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const paramValue = req.params[paramName];
    
    if (!validateUUID(paramValue)) {
      return res.status(400).json({
        error: 'Invalid UUID format',
        parameter: paramName,
        value: paramValue
      });
    }
    
    next();
  };
}