-- Each school class has its own board. Existing rows stay on 8А.
create table if not exists classes (
  code         text primary key,
  grade        smallint not null default 8 check (grade between 7 and 11),
  period_count smallint not null default 8 check (period_count between 1 and 12),
  cycle_week   smallint not null default 1 check (cycle_week in (1, 2))
);

insert into classes (code, grade, period_count, cycle_week)
select '8А', grade, period_count, coalesce(cycle_week, 1)
from class_settings
where id = 1
on conflict (code) do nothing;

insert into classes (code) values ('8А') on conflict do nothing;

alter table homework add column if not exists class_code text not null default '8А';
alter table timetable add column if not exists class_code text not null default '8А';
alter table textbooks add column if not exists class_code text not null default '8А';

create index if not exists homework_class_due_idx on homework (class_code, due_on);
create index if not exists timetable_class_idx on timetable (class_code, week, weekday, period);

do $$
declare r record;
begin
  for r in
    select c.conname
    from pg_constraint c
    join pg_class t on t.oid = c.conrelid
    join pg_namespace n on n.oid = t.relnamespace
    where t.relname = 'timetable'
      and n.nspname = 'public'
      and c.contype = 'u'
  loop
    execute format('alter table timetable drop constraint if exists %I', r.conname);
  end loop;
end $$;

alter table timetable add constraint timetable_class_week_day_period_key
  unique (class_code, week, weekday, period);

alter table textbooks drop constraint if exists textbooks_pkey;
alter table textbooks add constraint textbooks_pkey primary key (class_code, subject);
