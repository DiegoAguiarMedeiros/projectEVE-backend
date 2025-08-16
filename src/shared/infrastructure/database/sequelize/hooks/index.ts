import { DomainEvents } from '../../../../domain/events/DomainEvents';
import { UniqueEntityID } from '../../../../domain/UniqueEntityID';
import models from '../models';

const dispatchEventsCallback = (model: any, primaryKeyField: string) => {
  const aggregateId = new UniqueEntityID(model[primaryKeyField]);
  DomainEvents.dispatchEventsForAggregate(aggregateId);
}

(async function createHooksForAggregateRoots() {
  const { Users,  Debts, Transactions, ProcessedIncome, Incomes } = models;

  Users.addHook('afterCreate', (m: any) => dispatchEventsCallback(m, 'id'));
  Users.addHook('afterDestroy', (m: any) => dispatchEventsCallback(m, 'id'));
  Users.addHook('afterUpdate', (m: any) => dispatchEventsCallback(m, 'id'));
  Users.addHook('afterSave', (m: any) => dispatchEventsCallback(m, 'id'));
  Users.addHook('afterUpsert', (m: any) => dispatchEventsCallback(m, 'id'));

  Debts.addHook('afterCreate', (m: any) => dispatchEventsCallback(m, 'id'));
  Debts.addHook('afterDestroy', (m: any) => dispatchEventsCallback(m, 'id'));
  Debts.addHook('afterUpdate', (m: any) => dispatchEventsCallback(m, 'id'));
  Debts.addHook('afterSave', (m: any) => dispatchEventsCallback(m, 'id'));
  Debts.addHook('afterUpsert', (m: any) => dispatchEventsCallback(m, 'id'));

  Transactions.addHook('afterCreate', (m: any) => dispatchEventsCallback(m, 'id'));
  Transactions.addHook('afterDestroy', (m: any) => dispatchEventsCallback(m, 'id'));
  Transactions.addHook('afterUpdate', (m: any) => dispatchEventsCallback(m, 'id'));
  Transactions.addHook('afterSave', (m: any) => dispatchEventsCallback(m, 'id'));
  Transactions.addHook('afterUpsert', (m: any) => dispatchEventsCallback(m, 'id'));

  ProcessedIncome.addHook('afterCreate', (m: any) => dispatchEventsCallback(m, 'id'));
  ProcessedIncome.addHook('afterDestroy', (m: any) => dispatchEventsCallback(m, 'id'));
  ProcessedIncome.addHook('afterUpdate', (m: any) => dispatchEventsCallback(m, 'id'));
  ProcessedIncome.addHook('afterSave', (m: any) => dispatchEventsCallback(m, 'id'));
  ProcessedIncome.addHook('afterUpsert', (m: any) => dispatchEventsCallback(m, 'id'));

  Incomes.addHook('afterCreate', (m: any) => dispatchEventsCallback(m, 'id'));
  Incomes.addHook('afterDestroy', (m: any) => dispatchEventsCallback(m, 'id'));
  Incomes.addHook('afterUpdate', (m: any) => dispatchEventsCallback(m, 'id'));
  Incomes.addHook('afterSave', (m: any) => dispatchEventsCallback(m, 'id'));
  Incomes.addHook('afterUpsert', (m: any) => dispatchEventsCallback(m, 'id'));


  console.info('[Hooks]: Sequelize hooks for aggregates registered.');
})();
