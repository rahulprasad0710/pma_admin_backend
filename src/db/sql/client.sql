CREATE TABLE
  public.user_customer (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    email_verified boolean NOT NULL DEFAULT false,
    image text NULL,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    updated_at timestamp without time zone NOT NULL DEFAULT now()
  );

ALTER TABLE
  public.user_customer
ADD
  CONSTRAINT user_customer_pkey PRIMARY KEY (id)


  CREATE TABLE
  public.account (
    id text NOT NULL,
    account_id text NOT NULL,
    provider_id text NOT NULL,
    user_id text NOT NULL,
    access_token text NULL,
    refresh_token text NULL,
    id_token text NULL,
    access_token_expires_at timestamp without time zone NULL,
    refresh_token_expires_at timestamp without time zone NULL,
    scope text NULL,
    password text NULL,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    updated_at timestamp without time zone NOT NULL DEFAULT now()
  );

ALTER TABLE
  public.account
ADD
  CONSTRAINT account_pkey PRIMARY KEY (id)

  CREATE TABLE
  public.session (
    id text NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    token text NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    updated_at timestamp without time zone NOT NULL DEFAULT now(),
    ip_address text NULL,
    user_agent text NULL,
    user_id text NOT NULL
  );

ALTER TABLE
  public.session
ADD
  CONSTRAINT session_pkey PRIMARY KEY (id)