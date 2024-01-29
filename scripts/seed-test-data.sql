-- DROP AND CREATE ENUMS
DROP TYPE IF EXISTS public.role_enum;
CREATE TYPE public.role_enum AS ENUM (
    'admin',
    'customer'
);

-- DROP AND CREATE TABLES
DROP TABLE IF EXISTS public.refresh_sessions;
CREATE TABLE public.refresh_sessions (
    id SERIAL PRIMARY KEY,
    "userId" INT NOT NULL,
    "refreshToken" VARCHAR(300) NOT NULL,
    fingerprint TEXT NOT NULL,
    ip VARCHAR(50) NOT NULL,
    "expiresIn" BIGINT NOT NULL
);

DROP TABLE IF EXISTS public.users;
CREATE TABLE public.users (
    id SERIAL PRIMARY KEY UNIQUE,
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(50) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    role public.role_enum,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);

DROP TABLE IF EXISTS public.words;
CREATE TABLE public.words (
    id SERIAL PRIMARY KEY UNIQUE,
    "uaName" varchar(50),
    "enName" varchar(50),
    "espName" varchar(50),
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);

DROP TABLE IF EXISTS public.users_words_words;
CREATE TABLE public.users_words_words (
    id SERIAL PRIMARY KEY,
    "usersId" INT NOT NULL,
    "wordsId" INT NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    FOREIGN KEY ("usersId") REFERENCES public.users(id),
    FOREIGN KEY ("wordsId") REFERENCES public.words(id)
);

-- INSERT DATA INTO TABLES
INSERT
INTO users ("firstName", "lastName", email, password, role)
VALUES
    ('Kateryna', 'Shakiryanova', 'kshak@gmail.com', '$2a$10$/vVJW5eh1GRE6ivYlNspROnx6ej6gGWRDEi4SGpXzTZ0QuG/.vzkO', 'admin'),
    ('Mykyta', 'Trynyl', 'bestemail@gmail.com', '$2a$10$XwZyxDEquRB.hqxynbsweOAUp3BHfMn.iDRGstPFrmIwjIiidqZXu', 'customer');
