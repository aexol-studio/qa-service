import { MongoModel } from '../mongoModel';
import { ModelTypes } from '../zeus';

export type QuestionModel = Omit<MongoModel<ModelTypes['Question']>, 'answers'>;
