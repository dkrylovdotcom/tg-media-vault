import { NodeEnv } from '@global-modules/environment-variables/node-env';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class EnvironmentVariables {
  @IsEnum(NodeEnv)
  @IsOptional()
  NODE_ENV?: NodeEnv;

  @IsNumberString()
  @IsOptional()
  PORT = '3000';

  @IsOptional()
  @IsBoolean()
  @Transform(({ obj }) => obj.ENABLE_DB_LOG === 'true')
  ENABLE_DB_LOG: boolean = false;

  @IsString()
  TELEGRAM_BOT_TOKEN: string;

  @IsNumber()
  @Type(() => Number) 
  TELEGRAM_CHANNEL_ID: number;

  @IsOptional()
  @IsNumber()
  QUEUE_INTERVAL: number = 2000;

  @IsOptional()
  @IsString()
  DOWNLOAD_DIRECTORY_PATH: string = 'downloads';

  @IsOptional()
  @IsString()
  DOWNLOAD_ENDPOINT: string = '/downloads';
}
