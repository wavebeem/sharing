create database sharing;
use sharing;

create table expenses (
    id integer unsigned not null auto_increment,
    payer integer not null,
    amount double not null,
    date date not null,
    spent_for integer not null,
    description text not null,
    primary key (id)
);

create table payments (
    id integer unsigned not null auto_increment,
    payer integer not null,
    payee integer not null,
    amount double not null,
    date date not null,
    primary key (id)
);

create table people (
    id integer unsigned not null auto_increment,
    name text not null,
    primary key (id)
);
insert into people set name = 'everyone';
