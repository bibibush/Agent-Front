export interface ResponseAPI<T> {
  statusCode: number;
  message: string;
  data: T;
}
