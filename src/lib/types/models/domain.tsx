export interface Domain {
  _id: string;
  name: string;
  description?: string;
  connected: boolean;
  isPublic: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
