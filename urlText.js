import puppeteer from "puppeteer"
export const  getTextFromUrl = async(url) =>{
    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
    
        await page.goto(url);
    
        const allText = await page.evaluate(() => {
          return document.querySelector('body').innerText;
        });
    
        await browser.close();
        return allText
      } catch (error) {
        console.error('Error:', error);
      }
}


