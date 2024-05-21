import { ObjectId } from 'mongoose';

export class SellAssetDto {
  portfolioId: string;
  assetId: string;
  category: string;
  account: string;
  quantityToSell: number;
}
