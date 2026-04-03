import type { UserProfile } from "./types";

// Demo users — kept for login page demo functionality only
// All other data now comes from Supabase tables (see supabase/seed.sql)

export const demoUsers: UserProfile[] = [
  { id: "u1", email: "admin@zems.gov.zw", first_name: "Tendai", last_name: "Moyo", phone: "+263 77 123 4567", school_id: "sch1", role: "school_admin", is_active: true },
  { id: "u2", email: "ministry@zems.gov.zw", first_name: "Chipo", last_name: "Nyamande", role: "ministry_admin", is_active: true },
  { id: "u3", email: "bursar@school.co.zw", first_name: "Farai", last_name: "Chirwa", phone: "+263 71 234 5678", school_id: "sch1", role: "bursar", is_active: true },
  { id: "u4", email: "teacher@school.co.zw", first_name: "Blessing", last_name: "Ncube", phone: "+263 73 345 6789", school_id: "sch1", role: "teacher", is_active: true },
  { id: "u5", email: "parent@gmail.com", first_name: "Rumbidzai", last_name: "Mutasa", phone: "+263 77 456 7890", school_id: "sch1", role: "parent", is_active: true },
];
