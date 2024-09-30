import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CpiPolishYY, CpiPolishYYSchema } from './schemas/cpi-polish-yy.schema';
import { CPIService } from './cpi.polish.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: CpiPolishYY.name, schema: CpiPolishYYSchema }])],
  providers: [CPIService],
  exports: [CPIService,MongooseModule],
})
export class CpiModule {}
