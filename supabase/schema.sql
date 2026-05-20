create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  id bigserial primary key,
  username text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.offers (
  id bigserial primary key,
  category text not null,
  title_en text not null,
  title_es text,
  title_fr text,
  title_ar text,
  subtitle_en text,
  subtitle_es text,
  subtitle_fr text,
  subtitle_ar text,
  description_en text,
  description_es text,
  description_fr text,
  description_ar text,
  price numeric(12,2) not null default 0,
  currency text not null default 'EUR',
  duration text,
  included_features_en text,
  included_features_es text,
  included_features_fr text,
  included_features_ar text,
  image_url text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.availability (
  id bigserial primary key,
  offer_id bigint not null references public.offers(id) on delete cascade,
  available_date date not null,
  total_capacity integer not null default 10 check (total_capacity >= 0),
  booked_count integer not null default 0 check (booked_count >= 0),
  is_available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (offer_id, available_date)
);

create table if not exists public.booking_requests (
  id bigserial primary key,
  offer_id bigint references public.offers(id) on delete set null,
  full_name text not null,
  email text not null,
  phone text,
  country text,
  preferred_language text not null default 'en',
  category text,
  offer_title text,
  check_in date,
  check_out date,
  activity_date date,
  adults integer not null default 1 check (adults >= 1),
  children integer not null default 0 check (children >= 0),
  special_requests text,
  payment_method text,
  estimated_total numeric(12,2),
  booking_status text not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.booking_status_history (
  id bigserial primary key,
  booking_id bigint not null references public.booking_requests(id) on delete cascade,
  old_status text,
  new_status text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id bigserial primary key,
  sender_name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.gallery_assets (
  id bigserial primary key,
  image_url text not null,
  category text,
  caption text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payment_methods (
  id bigserial primary key,
  method_name text not null,
  method_type text not null,
  details text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id bigserial primary key,
  setting_key text not null unique,
  setting_value text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.visitor_sessions (
  id bigserial primary key,
  page_path text not null default '/',
  referrer text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists idx_offers_active_category on public.offers(is_active, category);
create index if not exists idx_availability_offer_date on public.availability(offer_id, available_date);
create index if not exists idx_booking_requests_status_created on public.booking_requests(booking_status, created_at desc);
create index if not exists idx_gallery_assets_active_category on public.gallery_assets(is_active, category);
create index if not exists idx_visitor_sessions_created_at on public.visitor_sessions(created_at desc);

create or replace function public.increment_availability_booking(
  p_offer_id bigint,
  p_available_date date
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.availability
  set booked_count = booked_count + 1,
      is_available = (booked_count + 1) < total_capacity,
      updated_at = now()
  where offer_id = p_offer_id
    and available_date = p_available_date;
end;
$$;

create or replace function public.get_admin_dashboard_data()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  result jsonb;
begin
  select jsonb_build_object(
    'stats', jsonb_build_object(
      'totalBookings', (select count(*) from public.booking_requests),
      'newBookings', (select count(*) from public.booking_requests where booking_status = 'new'),
      'confirmedBookings', (select count(*) from public.booking_requests where booking_status = 'confirmed'),
      'totalRevenue', coalesce((select sum(estimated_total) from public.booking_requests where booking_status in ('confirmed', 'completed')), 0),
      'totalContacts', (select count(*) from public.contact_messages),
      'unreadContacts', (select count(*) from public.contact_messages where is_read = false),
      'totalVisitors', (select count(*) from public.visitor_sessions),
      'todayVisitors', (select count(*) from public.visitor_sessions where created_at >= current_date)
    ),
    'recentBookings', coalesce((
      select jsonb_agg(row_to_json(t))
      from (
        select id, full_name, email, category, offer_title, estimated_total, booking_status, created_at
        from public.booking_requests
        order by created_at desc
        limit 10
      ) t
    ), '[]'::jsonb),
    'recentContacts', coalesce((
      select jsonb_agg(row_to_json(t))
      from (
        select id, sender_name, email, subject, is_read, created_at
        from public.contact_messages
        order by created_at desc
        limit 5
      ) t
    ), '[]'::jsonb),
    'bookingsByCategory', coalesce((
      select jsonb_agg(row_to_json(t))
      from (
        select category, count(*) as booking_count
        from public.booking_requests
        group by category
        order by booking_count desc
      ) t
    ), '[]'::jsonb),
    'monthlyRevenue', coalesce((
      select jsonb_agg(row_to_json(t))
      from (
        select to_char(created_at, 'YYYY-MM') as period,
               count(*) as bookings,
               coalesce(sum(estimated_total), 0) as revenue
        from public.booking_requests
        where booking_status in ('confirmed', 'completed')
        group by to_char(created_at, 'YYYY-MM')
        order by period desc
        limit 12
      ) t
    ), '[]'::jsonb)
  ) into result;

  return result;
end;
$$;

alter table public.admin_users enable row level security;
alter table public.offers enable row level security;
alter table public.availability enable row level security;
alter table public.booking_requests enable row level security;
alter table public.booking_status_history enable row level security;
alter table public.contact_messages enable row level security;
alter table public.gallery_assets enable row level security;
alter table public.payment_methods enable row level security;
alter table public.site_settings enable row level security;
alter table public.visitor_sessions enable row level security;

drop policy if exists "Public can read active offers" on public.offers;
create policy "Public can read active offers"
  on public.offers for select
  to anon, authenticated
  using (is_active = true);

drop policy if exists "Public can read availability" on public.availability;
create policy "Public can read availability"
  on public.availability for select
  to anon, authenticated
  using (true);

drop policy if exists "Public can create bookings" on public.booking_requests;
create policy "Public can create bookings"
  on public.booking_requests for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Public can create booking history" on public.booking_status_history;
create policy "Public can create booking history"
  on public.booking_status_history for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Public can create contact messages" on public.contact_messages;
create policy "Public can create contact messages"
  on public.contact_messages for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Public can read active gallery" on public.gallery_assets;
create policy "Public can read active gallery"
  on public.gallery_assets for select
  to anon, authenticated
  using (is_active = true);

drop policy if exists "Public can read active payment methods" on public.payment_methods;
create policy "Public can read active payment methods"
  on public.payment_methods for select
  to anon, authenticated
  using (is_active = true);

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings"
  on public.site_settings for select
  to anon, authenticated
  using (true);

drop policy if exists "Public can create visitor sessions" on public.visitor_sessions;
create policy "Public can create visitor sessions"
  on public.visitor_sessions for insert
  to anon, authenticated
  with check (true);

insert into public.admin_users (username, password_hash)
values ('admin', '$placeholder_change_on_setup$')
on conflict (username) do nothing;

insert into public.payment_methods (method_name, method_type, sort_order)
values
  ('Credit Card', 'credit_card', 1),
  ('PayPal', 'paypal', 2),
  ('Bank Transfer', 'bank_transfer', 3),
  ('Pay on Arrival', 'pay_on_arrival', 4)
on conflict do nothing;
