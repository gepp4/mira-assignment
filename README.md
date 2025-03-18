[![Built with Devbox](https://www.jetify.com/img/devbox/shield_galaxy.svg)](https://www.jetify.com/devbox/docs/contributor-quickstart/)

# Mira Assignment

## API

The project uses PNPM and Docker is required. It is suggested to install devbox to setup the local environment:

- [Install Devbox](https://www.jetify.com/docs/devbox/installing_devbox/)

and then run `devbox shell` to create it.

The project is built with [Hono](https://hono.dev/) and [Drizzle ORM](https://orm.drizzle.team/).
Navigate to the `api` folder and choose one of the following ways to start it.

### Docker

The `docker-compose.yml` file declares two services:

- The `api` service
- A development Postgres database

The `api` service takes the `DATABASE_URL` as an environment variable.

To start the project, run `docker-compose up -d`.

Finally, configure the database and seed it with some mock data:

```bash
pnpm i
pnpm db:update
pnpm db:seed
```

### Development

1. `docker-compose up -d db && echo "DATABASE_URL=postgresql://postgres:admin@localhost:5432/postgres" > .env` to start the local Postgres instance and create the `.env` file with the database url
2. `pnpm i` to install the dependencies
3. `pnpm db:update` to apply the migrations to the database
4. `pnpm db:seed` to seed the database with some fake players data
5. `pnpm dev` to start the project

### Usage

It retrieves a list of players from the database based on optional query parameters.

Query Parameters:

- `role` (optional): Filter players by their role (`[
      "goalkeeper",
      "defender",
      "midfielder",
      "forward",
    ]`).
- `isActive` (optional): Filter players by their active status. Accepts "true" or "false".
- `club` (optional): Filter players by their club name. Available clubs: ` [
  "Manchester United",
  "Real Madrid",
  "Barcelona",
  "Bayern Munich",
  "Juventus",
  "Paris Saint-Germain",
  "Liverpool",
  "Chelsea",
  "Manchester City",
  "Arsenal",
  "Atletico Madrid",
  "Inter Milan",
  "AC Milan",
  "Borussia Dortmund",
  "Tottenham Hotspur",
  "Ajax",
  "RB Leipzig",
  "Sevilla",
  "Napoli",
  "Roma",
];`
- `birthDateMin` (optional): Filter players born on or after a specific date (ISO 8601 format).
- `birthDateMax` (optional): Filter players born on or before a specific date (ISO 8601 format).

Response:

- Returns a JSON array of player objects matching the specified filters.
  
Examples:
- Retrieve active forwards born between 1990 and 2000:

  ```
  GET http://localhost:3000/api/players?role=forward&isActive=true&birthDateMin=1990-01-01&birthDateMax=2000-12-31
  ```

- Retrieve all players from "Barcelona":
 ```GET http://localhost:3000/api/players?club=Barcelona```


 Notes:
 - If no query parameters are provided, all players are returned.
 - The `isActive` parameter is case-sensitive and must be "true" or "false".
  

## Player Importer

The `Player Importer` script fetches player data from the Transfermarkt API for a specific club and saves it to a `players.txt` file. It tracks progress using a state file (`import-state-club-{clubId}.json`) to resume imports from the last processed player.

### Usage

Navigate to `player-importer`. 

1. Install the dependencies with `pnpm i`
2. Run the script: `pnpm start`


It keeps track of saved players by storing the current index on a file.

The output of the script will be a `players.txt` file.