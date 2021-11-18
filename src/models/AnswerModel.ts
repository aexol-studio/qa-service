import { MongoModel } from '../mongoModel';
import { ModelTypes } from '../zeus';

export type AnswerModel = Omit<MongoModel<ModelTypes['Answer']>, 'answers'>;
