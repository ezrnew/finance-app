import { Controller, Get, Query, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { CatsService } from './cats.service';
import { Cat } from './schemas/cat.schema';


@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}


  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
console.log("cialo",createCatDto)

    await this.catsService.create(createCatDto);

  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }

  // @Put(':id') // Update cat endpoint with an ID parameter
  // async update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto): Promise<Cat> {
  //   return this.catsService.update(id, updateCatDto);
  // }


//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return `This action returns a #${id} cat`;
//   }

// //   @Put(':id')
//   update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
//     return `This action updates a #${id} cat`;
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return `This action removes a #${id} cat`;
//   }
// }
}