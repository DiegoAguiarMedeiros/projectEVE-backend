export interface PaginationDTO<T> {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
    data: T[];
  }
  