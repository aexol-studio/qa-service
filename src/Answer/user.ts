import { FieldResolveInput } from 'stucco-js';
import { mc } from '../db';
import { AnswerModel } from '../models/AnswerModel';
import { UserModel } from '../models/UserModel';
import { oneModel } from '../mongoModel';
import { resolverFor } from '../zeus';

export const handler = async (input: FieldResolveInput) =>
  resolverFor('Answer', 'user', async (args, source: AnswerModel) => {
    const { db } = await mc();
    return oneModel(db.collection<UserModel>('User'), { username: source.user });
  })(input.arguments, input.source);
