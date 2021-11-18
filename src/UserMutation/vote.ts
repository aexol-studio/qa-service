import { FieldResolveInput } from 'stucco-js';
import { mc } from '../db';
import { AnswerModel } from '../models/AnswerModel';
import { QuestionModel } from '../models/QuestionModel';
import { UserModel } from '../models/UserModel';
import { oneModel, universalUpdateOne } from '../mongoModel';
import { resolverFor } from '../zeus';

export const handler = async (input: FieldResolveInput) =>
  resolverFor('UserMutation', 'vote', async (args, source: UserModel) => {
    const { db } = await mc();
    const [q, a] = [
      await oneModel(db.collection<QuestionModel>('Question'), { _id: args._id }),
      await oneModel(db.collection<AnswerModel>('Answer'), { _id: args._id }),
    ];
    if (q) {
      await universalUpdateOne(db.collection<QuestionModel>('Question'), { _id: args._id }, { score: q.score + 1 });
      return q.score + 1;
    } else if (a) {
      await universalUpdateOne(db.collection<AnswerModel>('Answer'), { _id: args._id }, { score: a.score + 1 });
      return a.score + 1;
    } else {
      throw new Error(`Cannot find update object with id ${args._id}`);
    }
  })(input.arguments, input.source);
