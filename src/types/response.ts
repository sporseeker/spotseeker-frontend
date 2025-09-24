export interface IApiResponse<T = unknown, E = unknown> {
  status: boolean;
  code: number;
  message: string;
  data: T;
  errors?: E;
}
