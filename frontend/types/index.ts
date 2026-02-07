export interface DayProgress {
  day_number: number;
  day_name: string;
  is_unlocked: boolean;
  is_completed: boolean;
  completion_time: string | null;
}

export interface UserProgress {
  user_id: string;
  days: DayProgress[];
  replay_mode: boolean;
  all_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface ValentineDay {
  number: number;
  name: string;
  date: string;
  quote: string;
  route: string;
}
