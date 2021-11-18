import { FieldResolveInput } from 'stucco-js';
import { resolverFor } from '../zeus';

export const handler = async (input: FieldResolveInput) =>
  resolverFor('Mutation', 'public', async (args) => {
    return {};
  })(input.arguments);
