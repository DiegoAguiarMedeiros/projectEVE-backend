import { Guard } from "../core/Guard";
import { Result } from "../core/Result";
import { ValueObject } from "./ValueObject";


interface PaginationProps<T> {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  data: T[];
}

export class Pagination<T> extends ValueObject<PaginationProps<T>> {
  public static maxPageSize: number = 100; 
  public static minPageSize: number = 1;   

  get currentPage(): number {
    return this.props.currentPage;
  }

  get pageSize(): number {
    return this.props.pageSize;
  }

  get totalPages(): number {
    return this.props.totalPages;
  }

  get totalItems(): number {
    return this.props.totalItems;
  }

  get data(): T[] {
    return this.props.data;
  }

  private constructor(props: PaginationProps<T>) {
    super(props);
  }

  public static create<T>(props: PaginationProps<T>): Result<Pagination<T>> {
    if (typeof props.pageSize !== 'number' || isNaN(props.pageSize) || props.pageSize < this.minPageSize || props.pageSize > this.maxPageSize) {
      return Result.fail<Pagination<T>>(`Page size must be between ${this.minPageSize} and ${this.maxPageSize}`);
    }

    if (props.currentPage < 0) {
      return Result.fail<Pagination<T>>('Current page cannot be less than 0');
    }

    if (props.totalPages < 0) {
      return Result.fail<Pagination<T>>('Total pages cannot be less than 0');
    }

    if (props.totalItems < 0) {
      return Result.fail<Pagination<T>>('Total items cannot be negative');
    }

    return Result.ok<Pagination<T>>(new Pagination<T>(props));
  }
}
