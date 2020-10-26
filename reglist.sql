create table towns
(
    id serial not null primary key,
    town text not null,
    code text not null
);
create table reg
(
    id serial not null primary key,
    reg_numb varchar not null,
    town_id int,
    foreign key (town_id) references towns(id)
);
