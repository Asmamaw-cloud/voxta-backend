import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'voxta chat app backend using nestjs!';
  }
}
