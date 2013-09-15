create table expenses (
    id integer primary key autoincrement,
    payer integer,
    amount real,
    date text,
    spent_for_id integer,
    description text
);

create table payments (
    id integer primary key autoincrement,
    payer integer,
    payee integer,
    amount real,
    date text
);

create table people (
    id integer primary key autoincrement,
    name text
);
