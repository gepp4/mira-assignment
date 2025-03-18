import fs from "fs";
import path from "path";
import axios from "axios";

interface ImportState {
  lastProcessedIndex: number;
  timestamp: string;
}

export class PlayerImporter {
  private clubId: number;
  private stateFilePath: string;

  constructor(clubId: number = 5) {
    this.clubId = clubId;
    this.stateFilePath = path.join(
      process.cwd(),
      `import-state-club-${clubId}.json`
    );
  }

  private async getLastProcessedIndex(): Promise<number> {
    try {
      if (fs.existsSync(this.stateFilePath)) {
        const stateData = fs.readFileSync(this.stateFilePath, "utf8");
        const state: ImportState = JSON.parse(stateData);
        return state.lastProcessedIndex;
      }
      return 0;
    } catch (error) {
      console.error("Error reading state file:", error);
      return 0;
    }
  }

  private saveState(index: number): void {
    const state: ImportState = {
      lastProcessedIndex: index,
      timestamp: new Date().toISOString(),
    };

    fs.writeFileSync(this.stateFilePath, JSON.stringify(state, null, 2));
  }

  private async getClubPlayers(): Promise<any[]> {
    try {
      const response = await axios.get(
        `https://transfermarkt-api.fly.dev/clubs/${this.clubId}/players`
      );

      return response.data.players || [];
    } catch (error) {
      console.error("Error fetching players from Transfermarkt API:", error);
      throw new Error("Failed to fetch players from Transfermarkt API");
    }
  }

  private async getPlayerDetails(playerId: number): Promise<any> {
    try {
      const response = await axios.get(
        `https://transfermarkt-api.fly.dev/players/${playerId}/profile`
      );

      return response.data;
    } catch (error) {
      console.error(`Error fetching details for player ${playerId}:`, error);
      throw new Error(`Failed to fetch details for player ${playerId}`);
    }
  }

  public async importPlayers(): Promise<void> {
    console.log(`Starting import for club ID ${this.clubId}`);

    try {
      const clubPlayers = await this.getClubPlayers();

      if (!clubPlayers.length) {
        console.error(`No players found for club ID ${this.clubId}`);
        return;
      }

      const lastIndex = await this.getLastProcessedIndex();
      console.log(`Resuming import from index ${lastIndex}`);

      // Filtra i giocatori rimanenti
      const playersToImport = clubPlayers.slice(lastIndex);

      for (let i = 0; i < playersToImport.length; i++) {
        const currentIndex = lastIndex + i;
        const player = playersToImport[i];

        try {
          const playerDetails = await this.getPlayerDetails(player.id);

          const playerData = `Player ID: ${player.id}, Name: ${playerDetails.name}\n`;
          fs.appendFileSync("players.txt", playerData);

          this.saveState(currentIndex + 1);

          console.log(
            `Imported player ${currentIndex + 1}/${clubPlayers.length}: ${
              playerDetails.name
            }`
          );
        } catch (error) {
          console.error(
            `Error importing player at index ${currentIndex}:`,
            error
          );

          this.saveState(currentIndex);
          throw error;
        }
      }

      console.log(
        `Import completed successfully for ${playersToImport.length} players`
      );
    } catch (error) {
      console.error("Error during import process:", error);
      throw error;
    }
  }
}

const importer = new PlayerImporter();
importer.importPlayers();
