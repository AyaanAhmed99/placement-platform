export interface Company {
  id: string;
  name: string;
  description: string | null;
  industry: string | null;
  location: string | null;
  website: string | null;
  approved: boolean;
  createdAt: string;
  recruiters?: { fullName: string }[];
}
