-- Create rooms table
create table public.rooms (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  location text not null,
  rent numeric not null,
  property_type text not null,
  tenant_preference text not null,
  contact text not null,
  images text[] default '{}'::text[],
  owner_id uuid references auth.users not null
);

-- Enable RLS
alter table public.rooms enable row level security;

-- Policies
-- 1. Anyone can view rooms
create policy "Public rooms are viewable by everyone."
  on rooms for select
  using ( true );

-- 2. Users can insert their own rooms
create policy "Users can insert their own rooms."
  on rooms for insert
  with check ( auth.uid() = owner_id );

-- 3. Users can update their own rooms
create policy "Users can update their own rooms."
  on rooms for update
  using ( auth.uid() = owner_id );

-- 4. Users can delete their own rooms
create policy "Users can delete their own rooms."
  on rooms for delete
  using ( auth.uid() = owner_id );

-- Storage Setup
-- Note: You might need to create the bucket 'room-images' via the Supabase Dashboard if this fails.
insert into storage.buckets (id, name, public) values ('room-images', 'room-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
create policy "Room images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'room-images' );

create policy "Authenticated users can upload images."
  on storage.objects for insert
  with check ( bucket_id = 'room-images' AND auth.role() = 'authenticated' );
