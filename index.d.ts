import { Role } from 'src/auth/enums/role.enum';

interface User {
  id?: string;
  email: string;
  password: string;
  role: Role;
}

interface Addon {
  id?: string;
  name: string;
  description: string;
  price: number;
  brand_id?: number;
  category_id?: number;
}

interface Category {
  id?: string;
  name: string;
  brand_id?: number;
}

interface Brand {
  id?: string;
  name: string;
}
