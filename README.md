# Home Library Service

## Description

This is a REST API service developed using NestJS, PostgreSQL, and Prisma. The project is containerized with Docker and includes working with a PostgreSQL database. The service provides access to data on albums, tracks, artists, and favorite records.

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone https://github.com/kontinentkm/nodejs2024Q3-service/tree/REST-service-Containerization%2C-Docker-and-Database-%26-ORM
```

```
cd nodejs2024Q3-service
```

## Installing NPM modules

```
npm install
```

## Set Up Environment Variables

Create a .env file in the project’s root directory with the following variables:

```
DATABASE_URL="postgresql://myuser:mypassword@postgres:5432/mydatabase?schema=public"
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=myuser
DB_PASSWORD=mypassword
DB_NAME=mydatabase
PORT=4000
```

## Build and Start Docker Containers

To build and start the containers, run:

```
docker-compose up -d
```

This command will create containers for the application and PostgreSQL database in the background.

## Apply Migrations and Initialize the Database

Access the application container:

```
docker exec -it nodejs2024q3-service-app-1 bash
```

In the container, run database migrations to create tables:

```
npx prisma migrate dev --name init
```

This command will create and apply migrations to the database.

## Run Prisma Studio

Prisma Studio provides a graphical interface for managing data. Prisma Studio must be run in the same Docker container as the application - nodejs2024q3-service-app-1. Start Prisma Studio to open it in your browser:

```
npx prisma studio
```

Once Prisma Studio is running, it will be available at http://localhost:5555.

## API Usage Examples

### Getting Data

#### Get all users:
```http
GET http://localhost:4000/users
```

#### Get a user by ID:
```http
GET http://localhost:4000/users/:id
```

#### Get all albums:
```http
GET http://localhost:4000/albums
```

#### Get an album by ID:
```http
GET http://localhost:4000/albums/:id
```

#### Get all tracks:
```http
GET http://localhost:4000/tracks
```

#### Get a track by ID:
```http
GET http://localhost:4000/tracks/:id
```

#### Get all favorites:
```http
GET http://localhost:4000/favs
```

#### Get favorites by type (artists, albums, tracks):
```http
GET http://localhost:4000/favs/artist/:id
GET http://localhost:4000/favs/album/:id
GET http://localhost:4000/favs/track/:id
```

---

### Adding Data

#### Add a new user:
```http
POST http://localhost:4000/users
Content-Type: application/json

{
  "login": "newUser",
  "password": "newPassword"
}
```

#### Add a new album:
```http
POST http://localhost:4000/albums
Content-Type: application/json

{
  "name": "New Album",
  "artistId": "artistId",
  "releaseDate": "2024-11-14"
}
```

#### Add a new track:
```http
POST http://localhost:4000/tracks
Content-Type: application/json

{
  "name": "New Track",
  "albumId": "albumId",
  "duration": 180
}
```

#### Add a new item to favorites (e.g., artist):
```http
POST http://localhost:4000/favs/artist/:id
Content-Type: application/json

{
  "userId": "userId"
}
```

#### Add a new item to favorites (e.g., album or track):
```http
POST http://localhost:4000/favs/album/:id
POST http://localhost:4000/favs/track/:id
Content-Type: application/json

{
  "userId": "userId"
}
```

---

### Updating Data

#### Update a user:
```http
PUT http://localhost:4000/users/:id
Content-Type: application/json

{
  "login": "updatedLogin",
  "password": "updatedPassword"
}
```

#### Update an album:
```http
PUT http://localhost:4000/albums/:id
Content-Type: application/json

{
  "name": "Updated Album",
  "artistId": "updatedArtistId",
  "releaseDate": "2024-11-15"
}
```

#### Update a track:
```http
PUT http://localhost:4000/tracks/:id
Content-Type: application/json

{
  "name": "Updated Track",
  "albumId": "updatedAlbumId",
  "duration": 200
}
```

---

### Deleting Data

#### Delete a user:
```http
DELETE http://localhost:4000/users/:id
```

#### Delete an album:
```http
DELETE http://localhost:4000/albums/:id
```

#### Delete a track:
```http
DELETE http://localhost:4000/tracks/:id
```

#### Delete an item from favorites (e.g., artist):
```http
DELETE http://localhost:4000/favs/artist/:id
```

#### Delete an item from favorites (e.g., album or track):
```http
DELETE http://localhost:4000/favs/album/:id
DELETE http://localhost:4000/favs/track/:id
```

---

### Notes

#### Data Types:
- **Content-Type**: application/json — All requests that include a request body must use this header.

#### Identifiers:
- For requests that affect specific entities (e.g., `:id`), replace the placeholder with the actual identifier of the entity.

#### Authorization:
- If your API requires authorization (e.g., using tokens), make sure to include the token in the header:
```http
Authorization: Bearer <your_token>
```

## Key Commands

Build and start containers:

```
docker-compose up -d
```

Stop containers:

```
docker-compose down
```

Rebuild containers:

```
docker-compose up --build -d
```

Run Prisma migrations:

```
docker exec -it nodejs2024q3-service-app-1 bash
npx prisma migrate dev --name <migration name>
```

Start Prisma Studio:

```
docker exec -it nodejs2024q3-service-app-1 bash
npx prisma studio
```

## Project Structure

- `src/` — Contains the application's main source code and business logic.
- `prisma/` — Holds Prisma schema files and database migration files.
- `Dockerfile` — Configuration file for building the application’s Docker container.
- `docker-compose.yml` — Configuration file for managing the multi-container setup (app and database).
- `.env` — Environment variable file for configuring database and application settings.

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
