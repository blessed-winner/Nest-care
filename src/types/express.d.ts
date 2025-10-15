import { Role } from '../user/entities/user.entity';

declare global {
  namespace Express {
    interface User {
      id: number;
      role: Role;
    }
  }
}

