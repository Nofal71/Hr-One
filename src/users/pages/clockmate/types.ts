export interface TimeEntry {
  type: 'In' | 'Out';
  time: Date;
  date: Date;
}

export interface UserFields {
  Clockin?: string;
  Clockout?: string;
  Title?: string;
  Email?: string;
  Date?: string;
  Duration?: string
}