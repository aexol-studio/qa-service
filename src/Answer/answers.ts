import { FieldResolveInput } from 'stucco-js';
import { mc } from '../db';
import { AnswerModel } from '../models/AnswerModel';
import { listModel } from '../mongoModel';
import { resolverFor } from '../zeus';

export const handler = async (input: FieldResolveInput) =>
  resolverFor('Answer', 'answers', async (args, source: AnswerModel) => {
    const { db } = await mc();
    return listModel(db.collection<AnswerModel>('Answer'), { to: source._id });
  })(input.arguments, input.source);
