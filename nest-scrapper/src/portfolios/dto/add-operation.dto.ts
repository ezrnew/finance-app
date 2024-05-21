import { ObjectId } from 'mongoose';

export class AddOperationDto {
  portfolioId: string;
  accountId: string;
  amount: number;
}
