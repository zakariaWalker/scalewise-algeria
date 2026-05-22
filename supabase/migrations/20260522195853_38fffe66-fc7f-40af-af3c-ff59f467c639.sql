
-- Profiles table
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  company_name text,
  industry text,
  employees text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "users view own profile" on public.profiles for select using (auth.uid() = id);
create policy "users update own profile" on public.profiles for update using (auth.uid() = id);
create policy "users insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Assessments table
create table public.assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  company_name text not null,
  industry text,
  employees text,
  answers jsonb not null default '{}'::jsonb,
  overall_score int,
  stage text,
  completed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.assessments enable row level security;

create policy "users view own assessments" on public.assessments for select using (auth.uid() = user_id);
create policy "users insert own assessments" on public.assessments for insert with check (auth.uid() = user_id);
create policy "users update own assessments" on public.assessments for update using (auth.uid() = user_id);
create policy "users delete own assessments" on public.assessments for delete using (auth.uid() = user_id);

create index assessments_user_idx on public.assessments(user_id, completed_at desc);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
