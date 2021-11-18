import { FieldResolveInput } from 'stucco-js';
import { mc } from '../db';
import { QuestionModel } from '../models/QuestionModel';
import { UserModel } from '../models/UserModel';
import { oneModel } from '../mongoModel';
import { resolverFor } from '../zeus';

export const handler = async (input: FieldResolveInput) =>
  resolverFor('Question', 'user', async (args, source: QuestionModel) => {
    const { db } = await mc();
    return oneModel(db.collection<UserModel>('User'), { username: source.user });
  })(input.arguments, input.source);
