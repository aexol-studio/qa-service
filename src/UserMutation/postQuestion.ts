import { FieldResolveInput } from 'stucco-js';
import { mc } from '../db';
import { QuestionModel } from '../models/QuestionModel';
import { UserModel } from '../models/UserModel';
import { universalInsert } from '../mongoModel';
import { resolverFor } from '../zeus';

export const handler = async (input: FieldResolveInput) =>
  resolverFor('UserMutation', 'postQuestion', async (args, source: UserModel) => {
    const { db } = await mc();
    const result = await universalInsert(db.collection<QuestionModel>('Question'), {
      score: 0,
      user: source.username,
      ...args.createQuestion,
    });
    return result.insertedId;
  })(input.arguments, input.source);
