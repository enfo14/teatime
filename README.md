
# TeaTime - A round robin to make tea

TeaTime is a simple app to select random tea members to make tea, like a round robin but for tea. The OpenAPI specification of the API is also included in the repository.

## How to run with Docker

You can run the app with Docker and `docker-compose`:

```bash
docker-compose up --build -d
```

This will run the Postgres database, back-end service and front-end application in Docker. Database migrations are run automatically during initialisation. The back-end API is served on `localhost:8000` and currently has no authentication layer. The front-end application is served on `localhost:8080`.

When running on a fresh setup, the database will be empty. It will be necessary to create team members (called 'Tea Makers' in the application).

## How to run manually

Alternatively, you may want to run it manually. In order to do this, you will need a Postgres database and a user with read/write permissions on this database. This README is not opinionated regarding your local Postgres setup.

### Back-end: Django Rest Framework

To run the back-end, [`pipenv`](https://github.com/pypa/pipenv) is recommended:

```bash
pipenv install --dev
pipenv shell
```

Assuming that the virtual environment is activated, you may run your back-end application with standard Django commands:

```bash
python manage.py migrate  # to run database migrations
python manage.py runserver  # to serve the application on port 8000
```

The behaviour of the server, particularly in regards to the connection to the database, is controlled via the following environment variables:

* `DATABASE_NAME` (default is `tea_robin`)
* `DATABASE_USER` (default is `tea_robin_user`)
* `DATABASE_PASSWORD` (default is `password123`)
* `DATABASE_HOST` (default is `localhost`)
* `DATABASE_PORT` (default is `5432`)

### Front-end: Angular application

To run the front-end, it is necessary to have `node 12` installed. It is also recommended that the `@angular/cli` NPM package is installed, although this isn't strictly necessary.

```bash
npm install
npm run serve  # to serve the application on port 4200
```

Just like with the Docker setup, the manual setup will not have any members in the database, which will need to be added by the user.

## Running tests

To run the back-end tests, the same `pipenv` virtual environment may be used:

```bash
pytest
```

To run the front-end tests, the same `node` setup may be used:
```bash
npm run test
```

