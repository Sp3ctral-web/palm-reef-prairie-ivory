-- Shared class homework board + weekly timetable (unowned rows, no accounts).
create table if not exists homework (
  id          serial primary key,
  subject     text not null,
  task        text not null,
  assigned_on date not null,
  due_on      date not null,
  added_by    text not null,
  created_at  timestamptz not null default now()
);

create index if not exists homework_due_on_idx on homework (due_on);
create index if not exists homework_subject_idx on homework (subject);

create table if not exists timetable (
  id       serial primary key,
  weekday  smallint not null check (weekday between 1 and 6),
  period   smallint not null check (period between 1 and 8),
  subject  text not null,
  unique (weekday, period)
);

-- Demo class: typical 8th-grade week. Dates are relative so the preview
-- always has today / tomorrow / overdue items.
insert into timetable (weekday, period, subject)
select * from (values
  (1, 1, 'Русский язык'),
  (1, 2, 'Алгебра'),
  (1, 3, 'История'),
  (1, 4, 'Физика'),
  (1, 5, 'Английский'),
  (1, 6, 'Физкультура'),
  (2, 1, 'Литература'),
  (2, 2, 'Геометрия'),
  (2, 3, 'Химия'),
  (2, 4, 'Биология'),
  (2, 5, 'Обществознание'),
  (2, 6, 'Информатика'),
  (3, 1, 'Алгебра'),
  (3, 2, 'Русский язык'),
  (3, 3, 'География'),
  (3, 4, 'Физика'),
  (3, 5, 'Английский'),
  (3, 6, 'История'),
  (4, 1, 'Геометрия'),
  (4, 2, 'Литература'),
  (4, 3, 'Химия'),
  (4, 4, 'ОБЖ'),
  (4, 5, 'Биология'),
  (4, 6, 'Физкультура'),
  (5, 1, 'Русский язык'),
  (5, 2, 'Алгебра'),
  (5, 3, 'Информатика'),
  (5, 4, 'Обществознание'),
  (5, 5, 'Английский'),
  (5, 6, 'География'),
  (6, 1, 'История'),
  (6, 2, 'Геометрия'),
  (6, 3, 'Физкультура'),
  (6, 4, 'Технология')
) as seed(weekday, period, subject)
where not exists (select 1 from timetable);

insert into homework (subject, task, assigned_on, due_on, added_by)
select * from (values
  ('Алгебра', '№ 124–128, учебник стр. 46. В тетради с проверкой.', current_date - 1, current_date, 'Аня'),
  ('История', 'Параграф 12, таблица «Реформы» — устно.', current_date - 2, current_date, 'Максим'),
  ('Русский язык', 'Сочинение «Осень в городе», 1 страница.', current_date - 1, current_date + 1, 'Лера'),
  ('Английский', 'Workbook p. 34, ex. 2–5. Выучить слова Unit 3.', current_date - 3, current_date + 1, 'Аня'),
  ('Физика', 'Задачи 18, 19 из карточки. Формулы в тетрадь.', current_date - 5, current_date - 1, 'Максим'),
  ('Геометрия', '№ 231, 232 (подобие треугольников). Чертёж обязателен.', current_date, current_date + 3, 'Лера'),
  ('Химия', 'Уравнения реакций 1–8, стр. 51.', current_date - 1, current_date + 4, 'Аня'),
  ('Биология', 'Конспект §9 «Клетка». Рисунок подписать.', current_date - 4, current_date + 2, 'Максим'),
  ('История', 'Параграф 8, конспект в тетрадь.', current_date - 22, current_date - 20, 'Лера'),
  ('Физика', 'Лабораторная «Сила трения» — отчёт.', current_date - 14, current_date - 11, 'Аня'),
  ('Литература', 'Выучить отрывок из «Капитанской дочки», стр. 88–89.', current_date - 8, current_date - 6, 'Максим'),
  ('Информатика', 'Практическая: таблица в Google Sheets, 15 строк.', current_date - 2, current_date + 6, 'Лера')
) as seed(subject, task, assigned_on, due_on, added_by)
where not exists (select 1 from homework);
