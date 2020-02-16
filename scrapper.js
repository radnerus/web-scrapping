const cheerio = require('cheerio');
const puppeteer = require('puppeteer');


const startScrapping = async () => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);

        await page.goto('https://www.proxysite.com');

        await page.$eval('input[name=d]', el => el.value = 'tamilrockers.com');

        const someContent = await page.$eval('input[name=d]', el => el.value);

        await page.click('button[type="submit"]');

        await page.goto(page.url());
        const pageRawHTML = await page.content();

        const pageHTML = cheerio.load(pageRawHTML);

        const newMovies = pageHTML('.ipsType_textblock').find('p').toArray();

        newMovies.splice(10);

        const movies = newMovies.map(ele => {
            const children = cheerio(ele).find('strong');

            const strong = cheerio(children).toArray();
            const movie = cheerio(strong).text();

            const movieName = movie.substring(0, movie.indexOf(')') + 1);
            const languages = languagesAvailable(movie);
            const isHD = isHighDef(movie);

            return { movieName, languages, isHD }
        });

        console.log(movies);

        await browser.close();
    } catch (error) {
        console.log('Error occurred');
        console.error(error);
    }
}

const languagesAvailable = (movie) => {
    const languages = [];
    movie = movie.toLowerCase();
    if (movie.indexOf('tamil') !== -1) languages.push('Tamil');
    if (movie.indexOf('english') !== -1) languages.push('English');
    if (movie.indexOf('telugu') !== -1) languages.push('Telugu');
    if (movie.indexOf('malayalam') !== -1) languages.push('Malayalam');
    if (movie.indexOf('kannada') !== -1) languages.push('Kannada');

    return languages;
}

const isHighDef = (movie) => {
    return (movie.toLowerCase().indexOf('hdrip') !== -1 || movie.toLowerCase().indexOf('bdrip') !== -1);
}

startScrapping();
