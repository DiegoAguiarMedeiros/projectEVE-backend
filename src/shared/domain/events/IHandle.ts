
import { IDomainEvent } from "./IDomainEvent";

export interface IHandle<T extends IDomainEvent> {
  setupSubscriptions(): void;
}
