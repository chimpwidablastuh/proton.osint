import puppeteer, { Browser, Page } from "puppeteer";
import {
  SEARCH_BAR,
  PERSONS_URL,
  RESULT_PERSON_NAME,
  RESULT_PERSON_CONTAINER,
  IS_DEV,
  USER_AGENT,
} from "../constants";
import { Company, Person } from "../types";
import Trace from "./Trace";

export class Proton {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private ready: boolean = false;

  constructor() {
    this.init();
  }

  async init() {
    this.browser = await puppeteer.launch({
      headless: !IS_DEV,
    });
    this.page = await this.browser.newPage();
    await this.page.setUserAgent(USER_AGENT);
    this.ready = true;
  }

  isReady(): boolean {
    return !!this.ready;
  }

  async waitForReady(): Promise<boolean> {
    while (!this.isReady()) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    return true;
  }

  async getPerson(targetName: string): Promise<Person[]> {
    let results: Person[] = [];

    await this.waitForReady();

    const page: Page = this.page as Page;

    await page.goto(PERSONS_URL);

    await page.waitForSelector(SEARCH_BAR);

    await page.type(SEARCH_BAR, targetName);

    await page.keyboard.press("Enter");

    const hasResults = await page.waitForSelector(RESULT_PERSON_NAME, {
      timeout: 5000,
    });

    // Is there some more pages?
    const hasMultiplePage = hasResults
      ? await page
          .waitForSelector(".pagination-basdepage .texte-droite p", {
            timeout: 1000,
          })
          .catch((e) => false)
      : false;

    if (!hasResults) {
      return [];
    } else if (hasResults && hasMultiplePage) {
      // get .pagination-basdepage .texte-droite p innerHTML
      const innerHTMLs = await page.$$eval(
        ".pagination-basdepage .texte-droite p",
        (elements) => elements.map((element) => element.innerHTML)
      );

      const maxPage = parseInt(innerHTMLs[0].split(" / ")[1], 10);

      const url = page.url();
      let didFinish = false;
      let pageCount = 0;
      while (!didFinish && pageCount <= maxPage) {
        const hasStillResults = !!(await page.waitForSelector(
          RESULT_PERSON_NAME,
          {
            timeout: 2000,
          }
        ));

        if (!hasStillResults) {
          Trace.log("No more results.");
          didFinish = true;
        } else {
          await page.goto(
            `${url}${pageCount === 0 ? "" : `&page=${pageCount}`}`
          );
          console.log(
            `Getting page results of page [${pageCount + 1} / ${maxPage}]...`
          );
          const moreResults = await this.getPersonPage();
          results = [...results, ...moreResults];
        }
        pageCount++;
      }
      return results;
    } else {
      results = await this.getPersonPage();
    }
    return results;
  }

  async getPersonPage(): Promise<Person[]> {
    await this.waitForReady();

    const page: Page = this.page as Page;

    await page.waitForSelector(RESULT_PERSON_NAME, {
      timeout: 2000,
    });

    const persons = await page.$$eval(RESULT_PERSON_NAME, (elements) => {
      console.log(elements);
      return elements.map((el) => {
        const anchorElement = el as HTMLAnchorElement;
        return {
          name: el.textContent,
          link: anchorElement.href,
        };
      });
    });

    console.log("temp persons:", persons);

    const societies = (await page.$$eval(
      RESULT_PERSON_CONTAINER,
      (containers) => {
        return containers.map((container) => {
          const links = container.querySelectorAll("a");
          return Array.from(links).map((link) => {
            return {
              name: link.innerText,
              link: link.href,
            };
          });
        });
      }
    )) as Company[][];

    const formatted: Person[] = persons.map((person, index) => ({
      ...person,
      name: person.name || "", // Ensure name is not nullable
      companies: societies[index],
    }));

    return formatted || [];
  }
}

export default new Proton();
