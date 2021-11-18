import { FieldResolveInput } from 'stucco-js';
import { mc } from '../db';
import { AnswerModel } from '../models/AnswerModel';
import { QuestionModel } from '../models/QuestionModel';
import { UserModel } from '../models/UserModel';
import { universalInsert } from '../mongoModel';
import { resolverFor } from '../zeus';

export const handler = async (input: FieldResolveInput) =>
  resolverFor('UserMutation', 'postAnswer', async (args, source: UserModel) => {
    const { db } = await mc();
    const result = await universalInsert(db.collection<AnswerModel>('Answer'), {
      score: 0,
      user: source.username,
      ...args.createAnswer,
    });
    return result.insertedId;
  })(input.arguments, input.source);
