import { Role } from 'src/auth/enums/role.enum';

interface User {
  id?: string | number;
  email: string;
  password: string;
  role: Role;
}

interface Addon {
  id?: string | number;
  name: string;
  description: string;
  price: number;
  brand_id?: number;
  category_id?: number | string;
}

interface Category {
  id?: string | number;
  name: string;
  brand_id?: number;
}

interface Brand {
  id?: string | number;
  name: string;
}

type TokenPayload = {
  email: string;
  sub: string | number;
};
