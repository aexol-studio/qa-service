import { Collection, Filter, MatchKeysAndValues, ObjectId, OptionalId, UpdateFilter, WithId } from 'mongodb';

type ToMongo<T> = T extends object[] ? string[] : T extends object ? string : T;
type Nullify<T> = T extends undefined ? undefined | null : T;
type NullifyObject<T> = {
  [P in keyof T]: Nullify<T[P]>;
};

export type MongoModel<T, Replace = {}> = NullifyObject<{
  [P in keyof Omit<T, keyof Replace>]: ToMongo<T[P]>;
}> &
  Replace;

export const listModel = async <T>(collection: Collection<T>, filter: Filter<WithId<T>>) => {
  const findResult = await collection.find(filter).toArray();
  return findResult;
};

export const oneModel = async <T>(collection: Collection<T>, filter: Filter<T>) => {
  const findResult = await collection.findOne(filter);
  return findResult;
};

export const matchToCollection =
  <T extends { _id: string }>(name: string, items: T[]) =>
  (id: string) => {
    const i = items.find((item) => item._id === id);
    if (!i) {
      throw new Error(`Cannot find item with id "${id}" in collection "${name}"`);
    }
    return i;
  };

export const universalInsert = async <T>(
  collection: Collection<T>,
  params: Omit<OptionalId<T>, 'createdAt' | 'updatedAt' | '_id'>,
) => {
  return collection.insertOne({
    ...params,
    _id: new ObjectId().toHexString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as unknown as OptionalId<T>);
};

export const universalUpdateOne = async <T>(
  collection: Collection<T>,
  filter: Filter<T>,
  params: Omit<UpdateFilter<T> | Partial<T>, 'updatedAt'>,
) => {
  return collection.updateOne(filter, {
    $set: { ...params, updatedAt: new Date().toISOString() } as Partial<T>,
  });
};
