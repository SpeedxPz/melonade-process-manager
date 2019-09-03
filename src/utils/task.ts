import * as R from 'ramda';
import { isString } from './common';
import { IWorkflow } from '../workflow';
import { ITask } from '../task';

export const mapInputFromTaskData = (
  inputParameters: { [key: string]: any },
  tasksData: { [taskReferenceName: string]: ITask | IWorkflow },
): { [key: string]: any } => {
  const inputParametersPairs = R.toPairs(inputParameters);
  const inputPairs = inputParametersPairs.map(
    ([key, value]: [string, string | any]): [string, any] => {
      if (
        isString(value) &&
        /^\${[a-z0-9-_]{1,32}[a-z0-9-_.]+}$/i.test(value)
      ) {
        return [
          key,
          R.path(value.replace(/(^\${)(.+)(}$)/i, '$2').split('.'), tasksData),
        ];
      }
      return [key, value];
    },
  );
  return R.fromPairs(inputPairs);
};