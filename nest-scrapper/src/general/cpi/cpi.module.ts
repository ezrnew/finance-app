import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CpiPolishYY, CpiPolishYYSchema } from './schemas/cpi-polish-yy.schema';
import { CPIService } from './cpi.polish.service';
import { CpiPolishMM, CpiPolishMMSchema } from './schemas/cpi-polish-mm.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: CpiPolishYY.name, schema: CpiPolishYYSchema },


    { name: CpiPolishMM.name, schema: CpiPolishMMSchema }

  ])],




  providers: [CPIService],
  exports: [CPIService,MongooseModule],
})
export class CpiModule {}
