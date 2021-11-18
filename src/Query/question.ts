import { FieldResolveInput } from 'stucco-js';
import { mc } from '../db';
import { QuestionModel } from '../models/QuestionModel';
import { listModel, oneModel } from '../mongoModel';
import { resolverFor } from '../zeus';

export const handler = async (input: FieldResolveInput) =>
  resolverFor('Query', 'question', async (args) => {
    const { db } = await mc();
    const result = await oneModel(db.collection<QuestionModel>('Question'), { _id: args._id });
    return result;
  })(input.arguments);
