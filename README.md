# Introduction

Learn Words 

# Description

Project with functionality for authorization and authentication using Nest.js framework and PostgreSQL database with TypeORM.

## Installation

```bash
$ npm install
```

## Running the app

There a couple of ways you can run the backend application using docker containers or locally.

1. Using docker-compose to run the backend and the database in their respective containers with little to no setup. Just install docker-desktop or docker engine and CLI for your OS and docker-compose. After that follow the instructions up until running `docker-compose up` in the root dir ot the project and should be all set. In case of having issues, understanding the configuration after the explanation on how to run, can help troubleshooting.

2. Running the application locally, and only the database in a container. You will need to create a database by yourself, then use a script seed-test-data.sql and run migrations. That is step also requires docker due to just how easy it is to not worry about the DB installation overhead and configuration for development.

```bash
$ npm start
$ npm run migration:run
```

## Environment variables file

There is a file `local.env` in the root dir of the project that has names of all variables which must be in `.env` file (which is ignored by git). Running the app locally and docker-compose both need it to load up their configurations.

## Running the backend with docker-compose

After you copy the `.env.example` to a `.env` file the setup is complete. Next you just need to run `docker-compose up` inside the root dir of the project and the app should run on `localhost:<PORT>`, where port is by default 27017 if you use docker-compose and 3000 if you locally.