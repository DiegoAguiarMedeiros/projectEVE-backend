import { UniqueEntityID } from '../domain/UniqueEntityID';

export const makeId = (val?: string) => new UniqueEntityID(val ?? 'test-id');
