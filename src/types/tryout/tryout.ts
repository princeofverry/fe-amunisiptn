import { Subtest } from "../subtest/subtest";
import { User } from "../user/user";

export interface Tryout {
  id: string;
  title: string;
  description: string;
  is_published: boolean;
  created_at: Date;
  updated_at: Date;
  creator: User;
  category: string;
  start_date: Date | null;
  end_date: Date | null;
  image_url: string | null;
  tryout_subtests: Subtest[];
}
