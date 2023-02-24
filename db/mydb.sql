
create table Registrations (
  person_id integer primary key AUTO_INCREMENT,
  firstName varchar(30),
  lastName varchar(30),
  grade integer,
  email varchar(40),
  shirtSize varchar(1),
  hrUsername varchar(30)
);

insert into Person (firstName, lastName, grade, email, shirtSize, hrUsername) values ('Caleb', 'Nguyen', 11, 'calebanhnguyen@gmail.com', 'M', 'best_hacker123');
insert into Person (firstName, lastName, grade, email, shirtSize, hrUsername) values ('Bob', 'Jones', 10, 'cnguy327@students.bju.edu', 'L', 'worst_hacker123');
