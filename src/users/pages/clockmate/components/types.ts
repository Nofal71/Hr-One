export interface UserFields {
  Clockin?: string;
  Clockout?: string;
  Duration?: string;
  Breakin?: string;
  Breakout?: string;
  [key: string]: string | undefined;
}