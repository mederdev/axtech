import { TokenType } from './token.type';

export class UserPayload {
  id: number;
  email: string;
  type: TokenType;
}
