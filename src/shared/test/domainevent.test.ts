import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { DomainEvents } from "../domain/events/DomainEvents"; // Import the DomainEvents class
import { AggregateRoot } from "../domain/AggregateRoot"; // Import the AggregateRoot class
import { UniqueEntityID } from "../domain/UniqueEntityID"; // Import the UniqueEntityID class
import { IDomainEvent } from "../domain/events/IDomainEvent"; // Import the IDomainEvent interface

class MockEvent implements IDomainEvent {
  constructor(public dateTimeOccurred: Date) {}
  getAggregateId(): UniqueEntityID {
    return new UniqueEntityID();
  }
}

class MockAggregateRoot extends AggregateRoot<any> {
  constructor(id: UniqueEntityID) {
    super({}, id);
  }
  addDomainEvent(event: IDomainEvent): void {
    this.domainEvents.push(event);
  }
  clearEvents(): void {
    this.domainEvents.splice(0, this.domainEvents.length);
  }
}

describe("DomainEvents", () => {
  beforeEach(() => {
    DomainEvents.clearHandlers();
    DomainEvents.clearMarkedAggregates();
  });

  describe("markAggregateForDispatch", () => {
    test("should mark an aggregate for dispatching", () => {
      const aggregateId = new UniqueEntityID();
      const aggregate = new MockAggregateRoot(aggregateId);

      DomainEvents.markAggregateForDispatch(aggregate);

      expect(DomainEvents["markedAggregates"]).toContain(aggregate);
    });
  });

  describe("dispatchEventsForAggregate", () => {
    test("should dispatch events for a marked aggregate", () => {
      const aggregateId = new UniqueEntityID();
      const aggregate = new MockAggregateRoot(aggregateId);

      const mockEvent = new MockEvent(new Date());
      aggregate.addDomainEvent(mockEvent);
      DomainEvents.markAggregateForDispatch(aggregate);

      const mockHandler = jest.fn();
      DomainEvents.register(mockHandler, "MockEvent");

      DomainEvents.dispatchEventsForAggregate(aggregateId);

      expect(mockHandler).toHaveBeenCalledWith(mockEvent);
      expect(aggregate.domainEvents).toHaveLength(0);
      expect(DomainEvents["markedAggregates"]).not.toContain(aggregate);
    });

    test("should not dispatch events for an unmarked aggregate", () => {
      const aggregateId = new UniqueEntityID();
      const aggregate = new MockAggregateRoot(aggregateId);

      const mockEvent = new MockEvent(new Date());
      aggregate.addDomainEvent(mockEvent);

      const mockHandler = jest.fn();
      DomainEvents.register(mockHandler, "MockEvent");

      DomainEvents.dispatchEventsForAggregate(aggregateId);

      expect(mockHandler).not.toHaveBeenCalled();
      expect(aggregate.domainEvents).toHaveLength(1);
    });
  });

  describe("register", () => {
    test("should register a handler for a specific event", () => {
      const mockHandler = jest.fn();
      DomainEvents.register(mockHandler, "MockEvent");

      expect(DomainEvents["handlersMap"]["MockEvent"]).toContain(mockHandler);
    });
  });

  describe("clearHandlers", () => {
    test("should clear all registered handlers", () => {
      const mockHandler = jest.fn();
      DomainEvents.register(mockHandler, "MockEvent");

      DomainEvents.clearHandlers();

      expect(DomainEvents["handlersMap"]).toEqual({});
    });
  });

  describe("clearMarkedAggregates", () => {
    test("should clear all marked aggregates", () => {
      const aggregateId = new UniqueEntityID();
      const aggregate = new MockAggregateRoot(aggregateId);
      DomainEvents.markAggregateForDispatch(aggregate);

      DomainEvents.clearMarkedAggregates();

      expect(DomainEvents["markedAggregates"]).toEqual([]);
    });
  });
});
