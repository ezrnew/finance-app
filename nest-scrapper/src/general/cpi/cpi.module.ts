import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cpi, CpiSchema } from './schemas/cpi.schema';
import { CPIService } from './cpi.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Cpi.name, schema: CpiSchema }])],
  providers: [CPIService],
  exports: [CPIService],
})
export class CpiModule {}
