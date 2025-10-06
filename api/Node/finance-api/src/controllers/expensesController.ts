import { Request, Response, NextFunction } from 'express';
// import { items, Item } from '../models/item';

// Read all items
export const getExpenses = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json("{list of expenses would be here}");
  } catch (error) {
    next(error);
  }
};