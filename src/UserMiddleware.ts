import { FieldResolveInput } from 'stucco-js';
import { verify } from 'jsonwebtoken';
import { UserModel } from './models/UserModel';
import { mc } from './db';

const decodeToken = (token: string) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT secret not set');
  }
  const verifiedToken = verify(token, process.env.JWT_SECRET);
  if (typeof verifiedToken !== 'object') {
    throw new Error('Token is not an object');
  }
  if (!('phone' in verifiedToken)) {
    throw new Error('Invalid token');
  }
  return verifiedToken as { phone: string };
};

export const getUser = async (token: string): Promise<UserModel | undefined> => {
  const { db } = await mc();
  const col = await db.collection<UserModel>('UserCol');
  const { phone } = decodeToken(token);
  const user = await col.findOne({
    phone,
  });
  if (!user) {
    return;
  }
  return user;
};
export const getUserFromHandlerInput = async (input: FieldResolveInput): Promise<UserModel | undefined> => {
  if (!input.protocol?.headers) {
    return;
  }
  const { Authorization }: { Authorization?: string[] } = input.protocol.headers;
  if (!Authorization) {
    return;
  }
  const findUser = await getUser(Authorization[0]);
  if (!findUser) {
    return;
  }
  return findUser;
};

export const getUserFromHandlerInputOrThrow = async (input: FieldResolveInput): Promise<UserModel> => {
  const user = await getUserFromHandlerInput(input);
  if (!user) {
    throw new Error('You are not logged in');
  }
  return user;
};

export const isAdmin = async (phone: string): Promise<boolean> => {
  if (phone === process.env.SUPERADMIN) {
    return true;
  }
  const { db } = await mc();
  const adminExists = await db.collection('Admin').findOne({
    phone,
  });
  return !!adminExists;
};

export const isAdminOrThrow = async (input: FieldResolveInput): Promise<void> => {
  const user = await getUserFromHandlerInputOrThrow(input);
  const admin = await isAdmin(user.phone);
  if (!admin) {
    throw new Error('Only administrator of the system can access this endpoint');
  }
};
