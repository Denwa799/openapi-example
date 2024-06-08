import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { AppService } from './app.service';
import { ErrorDto, JsonDto, ServerErrorDto } from './app.dto';
import { getRandomInt } from './lib';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @ApiTags('text')
  @ApiResponse({
    status: HttpStatus.OK,
    content: {
      'text/plain': {
        schema: {
          type: 'string',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ErrorDto,
  })
  @ApiResponse({
    status: '5XX',
    type: ServerErrorDto,
  })
  @Get('/text')
  text(): string {
    const number = getRandomInt(3);
    if (number === 0) throw new HttpException('Error', HttpStatus.BAD_REQUEST);
    else if (number === 1) {
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return 'text plain';
  }

  @ApiTags('json')
  @ApiResponse({
    status: HttpStatus.OK,
    type: JsonDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ErrorDto,
  })
  @ApiResponse({
    status: '5XX',
    type: ServerErrorDto,
  })
  @Get('/json')
  json(): JsonDto {
    const number = getRandomInt(3);
    if (number === 0) throw new HttpException('Error', HttpStatus.BAD_REQUEST);
    else if (number === 1) {
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return {
      data: 'data',
    };
  }

  @ApiTags('xml')
  @ApiResponse({
    status: HttpStatus.OK,
    content: {
      'application/xml': {
        schema: {
          type: 'string',
          example: '<example>This is an example response</example>',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ErrorDto,
  })
  @ApiResponse({
    status: '5XX',
    type: ServerErrorDto,
  })
  @Get('/xml')
  xml(): string {
    const number = getRandomInt(3);
    if (number === 0) throw new HttpException('Error', HttpStatus.BAD_REQUEST);
    else if (number === 1) {
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return '<example>This is an example response</example>';
  }
}
