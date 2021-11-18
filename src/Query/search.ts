import { FieldResolveInput } from 'stucco-js';
import { mc } from '../db';
import { QuestionModel } from '../models/QuestionModel';
import { listModel } from '../mongoModel';
import { resolverFor } from '../zeus';

export const handler = async (input: FieldResolveInput) =>
  resolverFor('Query', 'search', async (args) => {
    const { db } = await mc();
    const results = await listModel(db.collection<QuestionModel>('Question'), { $text: { $search: args.query } });
    return results.map((r) => ({
      question: r,
      bestAnswer: null,
    }));
  })(input.arguments);
