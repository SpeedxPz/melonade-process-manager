// Serializer for 2 layer node (${root}/${workflowName}/${workflowRev})
import { WorkflowDefinition } from '@melonade/melonade-declaration';
import * as R from 'ramda';
import { MemoryStore } from '.';
import { IWorkflowDefinitionStore } from '..';

export class WorkflowDefinitionMemoryStore extends MemoryStore
  implements IWorkflowDefinitionStore {
  constructor() {
    super();
  }

  get(
    name: string,
    rev: string,
  ): Promise<WorkflowDefinition.IWorkflowDefinition> {
    return R.pathOr(null, [name, rev], this.localStore);
  }

  create = async (
    workflowDefinition: WorkflowDefinition.IWorkflowDefinition,
  ): Promise<WorkflowDefinition.IWorkflowDefinition> => {
    const isWorkflowExists = R.path(
      [workflowDefinition.name, workflowDefinition.rev],
      this.localStore,
    );

    if (isWorkflowExists)
      throw new Error(
        `Workflow: ${workflowDefinition.name}${workflowDefinition.rev} already exists`,
      );

    this.localStore[workflowDefinition.name] = R.set(
      R.lensPath([workflowDefinition.rev]),
      workflowDefinition,
      this.localStore[workflowDefinition.name],
    );

    return workflowDefinition;
  };

  list(): Promise<WorkflowDefinition.IWorkflowDefinition[]> {
    return Promise.resolve(R.flatten(R.values(this.localStore).map(R.values)));
  }

  update(
    workflowDefinition: WorkflowDefinition.IWorkflowDefinition,
  ): Promise<WorkflowDefinition.IWorkflowDefinition> {
    this.localStore[workflowDefinition.name] = R.set(
      R.lensPath([workflowDefinition.rev]),
      workflowDefinition,
      this.localStore[workflowDefinition.name],
    );

    return Promise.resolve(workflowDefinition);
  }

  delete(name: string, rev: string): Promise<void> {
    this.localStore[name] = R.set(
      R.lensPath([rev]),
      undefined,
      this.localStore[name],
    );

    return Promise.resolve();
  }
}
