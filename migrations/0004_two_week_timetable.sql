-- Two-week rotating timetable (1 апта / 2 апта). Existing slots become week 1.
alter table timetable add column if not exists week smallint not null default 1;

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

alter table timetable drop constraint if exists timetable_week_check;
alter table timetable add constraint timetable_week_check check (week in (1, 2));
alter table timetable add constraint timetable_week_weekday_period_key unique (week, weekday, period);

alter table class_settings add column if not exists cycle_week smallint not null default 1;
