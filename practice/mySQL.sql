drop table mymember;

create table mymember(
	id varchar2(100),
	pw varchar2(100),
	tel varchar2(100)
)

insert into mymember values('admin', '1234', '010-1111-2222');

select * from mymember;