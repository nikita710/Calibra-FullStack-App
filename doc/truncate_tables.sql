use `full-stack-ecommerce`;
-- clean up previouse database tables

set foreign_key_checks = 0;

truncate customer;
truncate orders;
truncate order_item;
truncate address;

set foreign_key_checks=1;

alter table customer add unique(email);