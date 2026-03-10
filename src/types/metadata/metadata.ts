export interface Metadata {
  status: string;
  statusCode: number;
  message: string;
}

export interface ErrorResponse {
  meta: {
    status: string;
    statusCode: number;
    message: string;
  };
  data: null;
}
