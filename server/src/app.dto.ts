import { ApiProperty } from '@nestjs/swagger';

export class JsonDto {
  @ApiProperty()
  data: string;
}

export class ErrorDto {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string;
}

export class ServerErrorDto {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string;
}