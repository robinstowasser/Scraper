const playwright = require('playwright')
const Excel = require('exceljs')
const path = require('path');
const jexcel = require('xls-write');

require('dotenv').config()

;(async () => {
  const sleep = async (millis) => {
    return new Promise((resolve) => setTimeout(resolve, millis));
  };

  const FormatDate = (date) => {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  }

  const generateNewExcel = (data, keys) => {
    const workbook = new Excel.Workbook();
    const workSheet = workbook.addWorksheet('Temp');

    const columns = keys.map(k => { return {header: k, key: k} });
    workSheet.columns = columns;
    data.forEach((d) => {
      workSheet.addRow(d);
    });

    const exportPath = path.resolve(__dirname, 'test1.xlsx');
    workbook.xlsx.writeFile(exportPath);
  }

  const browser = await playwright.chromium.launch(
      {
        devtools: false,
        headless: false,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-zygote',
          '--disable-gpu',
        ],
      });
   
  const context = await browser.newContext();
  // Create a new page in a pristine context.
  const page = await context.newPage();
  await sleep(1000);
  // Pick3
  await page.goto('https://www.illinoislottery.com/dbg/results/pick3');
  await sleep(1000);

  const pick3Element = await page.waitForSelector(".results__list-item--clickable >> nth=0", {
      timeout: 1000 * 60 * 1,
    })
  await sleep(1000);
  const pick3Date = await pick3Element.waitForSelector(".dbg-results__date-info", {
      timeout: 1000 * 60 * 1,
    });
  let date = (await pick3Date.innerText());
  let dateArr = date.replace(',', '').split(" ");
  const Pick3resultDate = new Date(`${dateArr[2]} ${dateArr[0]} ${dateArr[1]}`);

  const pick31Label = await (await pick3Element.waitForSelector('#result-line-primary-0-1')).innerText();
  const pick32Label = await (await pick3Element.waitForSelector('#result-line-primary-1-1')).innerText();
  const pick33Label = await (await pick3Element.waitForSelector('#result-line-primary-2-1')).innerText();
  let Pick3Number = pick31Label + pick32Label + pick33Label;

  const Pick3middleOrDay = await (await pick3Element.waitForSelector('[data-test-id="draw-result-schedule-type-text-1"]')).innerText();
  
  const Pick3Label =  "Pick3-" + Pick3Number + "-" + Pick3middleOrDay + "-" + FormatDate(Pick3resultDate)
  // Pick4
  await page.goto('https://www.illinoislottery.com/dbg/results/pick4');
  await sleep(1000);

  const pick4Element = await page.waitForSelector(".results__list-item--clickable >> nth=0", {
      timeout: 1000 * 60 * 1,
    })
  await sleep(1000);
  const pick4Date = await pick4Element.waitForSelector(".dbg-results__date-info", {
      timeout: 1000 * 60 * 1,
    });
  date = (await pick4Date.innerText());
  dateArr = date.replace(',', '').split(" ");
  const Pick4resultDate = new Date(`${dateArr[2]} ${dateArr[0]} ${dateArr[1]}`);

  const pick41Label = await (await pick4Element.waitForSelector('#result-line-primary-0-1')).innerText();
  const pick42Label = await (await pick4Element.waitForSelector('#result-line-primary-1-1')).innerText();
  const pick43Label = await (await pick4Element.waitForSelector('#result-line-primary-2-1')).innerText();
  const pick44Label = await (await pick4Element.waitForSelector('#result-line-primary-3-1')).innerText();

  let Pick4Number = pick41Label + pick42Label + pick43Label + pick44Label;
  
  const Pick4middleOrDay = await (await pick4Element.waitForSelector('[data-test-id="draw-result-schedule-type-text-1"]')).innerText();
  const Pick4Label =  "Pick4-" + Pick4Number + "-" + Pick4middleOrDay + "-" + FormatDate(Pick4resultDate)

  const keys = ["pick3", "pick4"];

  const data = [
      {pick3: Pick3Label, pick4: Pick4Label}
    ];

  generateNewExcel(data, keys);
  await browser.close()
})()
