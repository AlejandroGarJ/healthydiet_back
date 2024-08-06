const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch({
            args: [
              '--incognito',
            ],
          });
        const page = await browser.newPage();

        // Aumenta el tiempo de espera y configura 'waitUntil' para esperar a que la página esté completamente cargada
        await page.goto('https://www.google.com/', { timeout: 60000, waitUntil: 'domcontentloaded' });

    } catch (error) {
        console.error('Error occurred while navigating:', error);
    }
})();