-- Luna Avila Beauty — schema do banco de dados
-- Execute este arquivo inteiro no Supabase: Dashboard > SQL Editor > New query > Run

create extension if not exists "pgcrypto";

-- ============ SERVICES ============
create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric(10,2) not null,
  duration_minutes int not null default 60,
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ============ BUSINESS HOURS (agenda semanal padrão) ============
create table if not exists business_hours (
  id uuid primary key default gen_random_uuid(),
  weekday int not null check (weekday between 0 and 6), -- 0 = domingo, 6 = sábado
  start_time time not null,
  end_time time not null,
  active boolean not null default true
);

-- ============ BLOCKED SLOTS (folgas, horários fechados) ============
create table if not exists blocked_slots (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  start_time time, -- null = bloqueia o dia inteiro
  end_time time,
  reason text,
  created_at timestamptz not null default now()
);

-- ============ APPOINTMENTS ============
create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  service_id uuid references services(id),
  client_name text not null,
  client_phone text not null,
  date date not null,
  start_time time not null,
  end_time time not null,
  status text not null default 'pending' check (status in ('pending','confirmed','done','cancelled')),
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists appointments_date_idx on appointments (date);
create index if not exists blocked_slots_date_idx on blocked_slots (date);

-- ============ ROW LEVEL SECURITY ============
-- RLS ligado e sem policies: só a service_role key (usada no servidor) acessa.
-- A anon key (usada no navegador) não tem nenhuma policy liberando acesso direto.
alter table services enable row level security;
alter table business_hours enable row level security;
alter table blocked_slots enable row level security;
alter table appointments enable row level security;

-- ============ SEED: serviços da tabela de preços ============
insert into services (name, price, duration_minutes, sort_order) values
  ('Design personalizado', 30.00, 30, 1),
  ('Design com henna', 40.00, 45, 2),
  ('Brow lamination', 90.00, 60, 3),
  ('Volume brasileiro', 100.00, 120, 4),
  ('Volume egípcio', 100.00, 120, 5),
  ('Volume power', 100.00, 120, 6),
  ('Volume fox', 120.00, 150, 7)
on conflict do nothing;

-- ============ SEED: horário padrão (segunda a sábado, 9h às 18h) ============
insert into business_hours (weekday, start_time, end_time) values
  (1, '09:00', '18:00'),
  (2, '09:00', '18:00'),
  (3, '09:00', '18:00'),
  (4, '09:00', '18:00'),
  (5, '09:00', '18:00'),
  (6, '09:00', '15:00')
on conflict do nothing;
