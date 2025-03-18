import { faker } from "@faker-js/faker";
import type { DB } from "@/db/index.js";
import { playerTable, type InsertPlayer } from "@/db/schema/player.js";

const teams = [
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
];

const N_PLAYERS = 20;

let mock: InsertPlayer[] = [];

for (let i = 0; i < N_PLAYERS; i++) {
  const player = {
    name: faker.person.fullName(),
    role: faker.helpers.arrayElement([
      "goalkeeper",
      "defender",
      "midfielder",
      "forward",
    ]),
    club: faker.helpers.arrayElement(teams),
    isActive: faker.datatype.boolean(),
    birthDate: faker.date.birthdate({mode:"age", min: 18, max: 40})
  };
  mock.push(player);
}

export async function seed(db: DB) {
  await db.insert(playerTable).values(mock);
}
