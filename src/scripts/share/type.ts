export interface ResponseAPI<T> {
  statusCode: number;
  message: string;
  data: T;
}

export type SSEEvent =
  | { type: "session"; data: string }
  | { type: "data"; data: string };
