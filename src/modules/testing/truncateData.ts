import { DataSource } from 'typeorm';
import { Controller, Delete, HttpCode } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { TestService } from './test.service';

@Controller('testing/all-data')
export class TruncateData {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private testService: TestService,
  ) {}

  @Delete()
  @HttpCode(204)
  async deleteAllData() {
    return this.testService.clearDb();
  }
}
