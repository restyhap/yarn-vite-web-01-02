export interface Permission {
  id: string;
  name: string;
}

export interface Module {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Record<string, boolean>;
} 