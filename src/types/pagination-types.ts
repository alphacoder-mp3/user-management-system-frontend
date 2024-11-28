export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  users: T[];
  pagination: PaginationInfo;
}

export interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
}
