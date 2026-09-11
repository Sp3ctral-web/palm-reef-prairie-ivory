-- Two-week due dates stay in the client. Schema: 12 periods max,
-- class grade, shared textbook catalog (unowned rows).

alter table timetable drop constraint if exists timetable_period_check;
alter table timetable add constraint timetable_period_check check (period between 1 and 12);

create table if not exists class_settings (
  id           smallint primary key default 1 check (id = 1),
  grade        smallint not null default 8 check (grade between 7 and 11),
  period_count smallint not null default 8 check (period_count between 1 and 12)
);

insert into class_settings (id, grade, period_count)
values (1, 8, 8)
on conflict (id) do nothing;

create table if not exists textbooks (
  subject text primary key,
  title   text not null
);

create table if not exists textbook_catalog (
  title text primary key
);
