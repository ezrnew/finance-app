import { ObjectId } from 'mongoose';

export class SellAssetDto {
  portfolioId: string;
  assetId: string;
  category: string;
  accountId: string;
  quantityToSell: number;
}
