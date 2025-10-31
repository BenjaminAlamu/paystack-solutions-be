type ObjectLiteral = {
    [key: string]: any;
  };
  
  type PaginationQuery = {
    perPage: number;
    page: number;
    search?: ObjectLiteral;
    where?: ObjectLiteral;
    status?: any;
  };
  