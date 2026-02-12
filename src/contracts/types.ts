export type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
export type EndpointRole = "public" | "advisor" | "advisor_or_secretary";

export interface EndpointContract {
  key: string;
  method: HttpMethod;
  path: string;
  role: EndpointRole;
  query?: string[];
}
