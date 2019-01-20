pragma foreignkeys=on;

create table users( user int primary key, 
                    email email not null unique, 
                    password password not null, 
                    firstName text, 
                    lastName text);
create table households(    household int primary key, 
                            name text, 
                            street text, 
                            city text);
create table members(   user int, 
                        household int,
                        primary key (user, household),
                        foreign key (user) references users(user), 
                        foreign key (household) references  households(household));
create table groceries( id primary key, 
                        household int, 
                        user int, 
                        item text,
                        foreign key (household) references households(household), 
                        foreign key (user) references users(user)
);
create table chores(    id int primary key, 
                        household int, 
                        user int, 
                        task text, 
                        date date,
                        foreign key (household) references households(household),
                        foreign key (user) references users(user));
create table rental(household int, 
                    user int, 
                    rent int, 
                    dueDate integer,
                    primary key(household, user));
create table payments(  household int, 
                        user int, 
                        due date, 
                        paid boolean);
create table landlords( household int, 
                        user int, 
                        primary key(household, user),
                        foreign key (household) references households(household),
                        foreign key (user) references users(user));



 
