import * as nock from 'nock';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'https://wizard-world-api.herokuapp.com';

type Inventor = {
  id: string;
  firstName: string;
  lastName: string;
}

type Elixir = {
  id: string;
  name: string;
  effect: string;
  sideEffects: string;
  characteristics: string;
  time: string;
  difficulty: string;
  ingredients: {
    id: string;
    name: string;
  }[];
  inventors: Inventor[];
  manufacturer: string
}

type Wizard = {
  elixirs: {
    id: string;
    name: string;
  }[];
  id: string;
  firstName: string;
  lastName: string;
}

async function fetchWizardsAndElixirs() {
  // Enable nock recording
  nock.recorder.rec({
    output_objects: true,
    dont_print: true,
  });

  try {
    const wizardsResponse = await fetch(`${BASE_URL}/wizards`);
    const wizards = await wizardsResponse.json() as Wizard[];

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    // keep track which elixirs have been queried to avoid duplicates
    const queriedElixirs: string[] = [];

    // Process all wizards and their elixirs sequentially
    for (const wizard of wizards) {
      for (const elixir of wizard.elixirs) {
        // Check if we've already queried this elixir
        if (!queriedElixirs.includes(elixir.id)) {
          console.log(`Fetching elixir ${elixir.id} (new)`);
          await delay(50); // Add delay to avoid rate limiting
          await fetch(`${BASE_URL}/elixirs/${elixir.id}`);
          queriedElixirs.push(elixir.id);
        } else {
          console.log(`Skipping elixir ${elixir.id} (already queried)`);
        }
      }
    }

    const recordings = nock.recorder.play();

    // Save recordings
    const recordingsDir = path.join(__dirname, '..', 'nock-recordings');
    if (!fs.existsSync(recordingsDir)) {
      fs.mkdirSync(recordingsDir);
    }

    fs.writeFileSync(
      path.join(recordingsDir, 'api.json'),
      JSON.stringify(recordings, null, 2),
    );
  } finally {
    // clean up nock
    nock.recorder.clear();
    nock.restore();
  }
}

(async () => {
  try {
    await fetchWizardsAndElixirs();
    console.log('Finished recording API responses');
  } catch (error) {
    console.error('Error in fetchWizardsAndElixirs:', error);
  }
})();