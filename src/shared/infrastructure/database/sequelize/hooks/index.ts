import { DomainEvents } from '../../../../domain/events/DomainEvents';
import { UniqueEntityID } from '../../../../domain/UniqueEntityID';
import models from '../models';

const dispatchEventsCallback = (model: any, primaryKeyField: string) => {
  const aggregateId = new UniqueEntityID(model[primaryKeyField]);
  DomainEvents.dispatchEventsForAggregate(aggregateId);
}

(async function createHooksForAggregateRoots() {
  const { User, Transaction, Debt, MonthlyEnvelope } = models;

  User.addHook('afterCreate', (m: any) => dispatchEventsCallback(m, 'id'));
  User.addHook('afterDestroy', (m: any) => dispatchEventsCallback(m, 'id'));
  User.addHook('afterUpdate', (m: any) => dispatchEventsCallback(m, 'id'));
  User.addHook('afterSave', (m: any) => dispatchEventsCallback(m, 'id'));
  User.addHook('afterUpsert', (m: any) => dispatchEventsCallback(m, 'id'));


  console.info('[Hooks]: Sequelize hooks for aggregates registered.');
})();
