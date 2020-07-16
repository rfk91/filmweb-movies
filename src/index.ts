import * as fs from 'fs';
import * as pptr from 'puppeteer';
import { asyncForEach } from './async-foreach';

const dir: string = './gen/';

const URL: string =
  'https://www.filmweb.pl/films/search?orderBy=popularity&descending=true';

const viewport: pptr.Viewport = {
  width: 800,
  height: 2840,
};

const startPage: number = 1;

const pages: number = 100;

interface Movie {
  poster: string;
  title: string;
  originalTitle: string;
  description: string;
  rate: string;
  year: string;
}

(async () => {
  try {
    const browser = await pptr.launch({
      headless: true,
    });

    const page = await browser.newPage();

    await page.setViewport(viewport);

    await page.goto(`${URL}&page=1`, {
      waitUntil: 'networkidle0',
    });

    // Close GDPR popup
    await page.click('button.fwBtn.fwBtn--gold');

    // Grab movies
    const allMovies = [];

    for (let i = startPage; i < pages + startPage; i++) {
      // Log current page number
      console.log(`Current page number: ${i}`);

      if (i > 1) {
        await page.goto(`${URL}&page=${i}`, {
          waitUntil: 'networkidle0',
        });
      }
      await page.screenshot({
        path: `${dir}page-${i}.png`,
      });
      const movies = await grabMovies(page);
      allMovies.push(movies);
    }

    const mergedMovies = [].concat(...allMovies);
    fs.writeFile(
      `${dir}result.json`,
      JSON.stringify(mergedMovies),
      (err: any) => {
        if (err) throw err;
        console.log('result.json file saved ok!');
      }
    );

    const meta = {
      length: mergedMovies.length,
    };
    fs.writeFile(`${dir}/meta.json`, JSON.stringify(meta), (err: any) => {
      if (err) throw err;
      console.log('meta.json file saved ok!');
    });

    await browser.close();
  } catch (error) {
    console.log(error);
  }
})();

async function grabMovies(page: pptr.Page) {
  const moviesEl = await page.$$('.hits__item');

  let movies: Movie[] = [];

  await asyncForEach(moviesEl, async (movieEl) => {
    const posterEl = await movieEl.$('.filmPreview__poster .poster__image');
    const posterElProp = await posterEl.getProperty('src');
    const poster: string = (await posterElProp.jsonValue()) as string;

    const titleEl = await movieEl.$('.filmPreview__title');
    const titleElProp = await titleEl.getProperty('innerText');
    const title: string = (await titleElProp.jsonValue()) as string;

    // Log movie titles as we go...
    console.log(title);

    let originalTitle: string;
    const originalTitleEl = await movieEl.$('.filmPreview__originalTitle');
    if (!originalTitleEl) {
      originalTitle = title;
    } else {
      const originalTitleElProp = await originalTitleEl.getProperty(
        'innerText'
      );
      originalTitle = (await originalTitleElProp.jsonValue()) as string;
    }

    const descriptionEl = await movieEl.$('.filmPreview__description > p');
    const descriptionElProp = await descriptionEl.getProperty('innerText');
    const description: string = (await descriptionElProp.jsonValue()) as string;

    const rateEl = await movieEl.$('.rateBox__rate');
    const rateElProp = await rateEl.getProperty('innerText');
    const rate: string = (await rateElProp.jsonValue()) as string;

    const yearEl = await movieEl.$('.filmPreview__year');
    const yearElProp = await yearEl.getProperty('innerText');
    const year: string = (await yearElProp.jsonValue()) as string;

    movies.push({
      poster,
      title,
      originalTitle,
      description,
      rate,
      year,
    });
  });

  return movies;
}
