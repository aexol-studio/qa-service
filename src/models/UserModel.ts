import { ModelTypes } from '../zeus';

export type UserModel = ModelTypes['User'] & { phone: string };
