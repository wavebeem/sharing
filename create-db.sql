create database if not exists sharing;
use sharing;

create table if not exists expenses (
    id integer unsigned not null auto_increment,
    payer integer not null,
    amount double not null,
    date date not null,
    spent_for_id integer not null,
    description text not null,
    primary key (id)
);

create table if not exists payments (
    id integer unsigned not null auto_increment,
    payer integer not null,
    payee integer not null,
    amount double not null,
    date date not null,
    primary key (id)
);

create table if not exists people (
    id integer unsigned not null auto_increment,
    name text not null,
    primary key (id)
);
