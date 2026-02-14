create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'buyer' check (role in ('buyer','seller','admin')),
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by owner" on public.profiles
  for select using (auth.uid() = id);

create policy "Profiles insert by owner" on public.profiles
  for insert with check (auth.uid() = id);

create policy "Profiles update by owner" on public.profiles
  for update using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'buyer'),
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid references public.profiles(id) on delete set null,
  title text not null,
  address text,
  city text,
  state text,
  zip text,
  price numeric not null,
  listing_type text not null,
  property_type text not null,
  bedrooms integer,
  bathrooms integer,
  sqft integer,
  year_built integer,
  description text,
  features text[],
  is_new boolean not null default false,
  is_featured boolean not null default false,
  matterport_url text,
  thumbnail_url text,
  agent_name text,
  agent_phone text,
  agent_email text,
  agent_photo text,
  created_at timestamptz not null default now()
);

alter table public.properties enable row level security;

create policy "Properties are viewable by everyone" on public.properties
  for select using (true);

create policy "Sellers can insert own properties" on public.properties
  for insert with check (
    auth.uid() = seller_id
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('seller','admin')
    )
  );

create policy "Sellers can update own properties" on public.properties
  for update using (
    auth.uid() = seller_id
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('seller','admin')
    )
  );

create policy "Sellers can delete own properties" on public.properties
  for delete using (
    auth.uid() = seller_id
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('seller','admin')
    )
  );

create table if not exists public.property_photos (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references public.properties(id) on delete cascade,
  label text not null,
  url text not null,
  sort_order integer default 0,
  created_at timestamptz not null default now()
);

alter table public.property_photos enable row level security;

create policy "Property photos are viewable by everyone" on public.property_photos
  for select using (true);

create policy "Sellers can insert photos" on public.property_photos
  for insert with check (
    exists (
      select 1
      from public.properties p
      join public.profiles prof on prof.id = p.seller_id
      where p.id = property_id
        and p.seller_id = auth.uid()
        and prof.role in ('seller','admin')
    )
  );

create policy "Sellers can update photos" on public.property_photos
  for update using (
    exists (
      select 1
      from public.properties p
      join public.profiles prof on prof.id = p.seller_id
      where p.id = property_id
        and p.seller_id = auth.uid()
        and prof.role in ('seller','admin')
    )
  );

create policy "Sellers can delete photos" on public.property_photos
  for delete using (
    exists (
      select 1
      from public.properties p
      join public.profiles prof on prof.id = p.seller_id
      where p.id = property_id
        and p.seller_id = auth.uid()
        and prof.role in ('seller','admin')
    )
  );

insert into storage.buckets (id, name, public)
values ('property-360', 'property-360', true)
on conflict (id) do nothing;

create policy "Public read property 360" on storage.objects
  for select using (bucket_id = 'property-360');

create policy "Authenticated upload property 360" on storage.objects
  for insert with check (bucket_id = 'property-360' and auth.role() = 'authenticated');

create policy "Owner delete property 360" on storage.objects
  for delete using (bucket_id = 'property-360' and auth.uid() = owner);

insert into storage.buckets (id, name, public)
values ('property-thumbnails', 'property-thumbnails', true)
on conflict (id) do nothing;

create policy "Public read property thumbnails" on storage.objects
  for select using (bucket_id = 'property-thumbnails');

create policy "Authenticated upload property thumbnails" on storage.objects
  for insert with check (bucket_id = 'property-thumbnails' and auth.role() = 'authenticated');

create policy "Owner delete property thumbnails" on storage.objects
  for delete using (bucket_id = 'property-thumbnails' and auth.uid() = owner);

create table if not exists public.saved_properties (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  property_id uuid references public.properties(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, property_id)
);

alter table public.saved_properties enable row level security;

create policy "Users can view own saved properties" on public.saved_properties
  for select using (auth.uid() = user_id);

create policy "Users can save properties" on public.saved_properties
  for insert with check (auth.uid() = user_id);

create policy "Users can unsave properties" on public.saved_properties
  for delete using (auth.uid() = user_id);
