create table expenses (
    id integer primary key autoincrement,
    payer integer,
    spent real,
    date text,
    spent_for_list text,
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
