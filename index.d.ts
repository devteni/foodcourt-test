import { Role } from 'src/auth/enums/role.enum';

interface User {
  id?: string;
  email: string;
  password: string;
  role: Role;
}
