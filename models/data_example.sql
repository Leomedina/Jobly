\c jobly 

DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS jobs;

CREATE TABLE companies (
  handle text PRIMARY KEY,
  name text NOT NULL,
  num_employees text NOT NULL,
  description text,
  logo_url text
);

CREATE TABLE jobs (
  id serial PRIMARY KEY,
  title text NOT NULL,
  salary float NOT NULL,
  equity float NOT NULL DEFAULT 0,
  date_posted date DEFAULT CURRENT_DATE NOT NULL,
  company_handle text NOT NULL REFERENCES companies ON DELETE CASCADE,
  listing_url text,
  CONSTRAINT jobs_equity_check CHECK ((equity < (1)::double precision))
);

CREATE TABLE users (
  email text PRIMARY KEY,
  password text NOT NULL,
  name text NOT NULL,
  photo_url text,
  is_admin boolean DEFAULT false NOT NULL
);