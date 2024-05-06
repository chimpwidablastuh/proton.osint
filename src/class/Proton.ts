import puppeteer, { Browser, Page } from "puppeteer";
import {
  USER_AGENT,
  SEARCH_BAR,
  PERSONS_URL,
  RESULT_PERSON_NAME,
  RESULT_PERSON_CONTAINER,
  HEADLESS,
} from "../constants";
import { Company, Person } from "../types";

export class Proton {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private ready: boolean = false;

  constructor() {
    this.init();
  }

  async init() {
    this.browser = await puppeteer.launch({
      headless: HEADLESS,
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
    await this.waitForReady();

    const page: Page = this.page as Page;

    await page.goto(PERSONS_URL);

    await page.waitForSelector(SEARCH_BAR);

    await page.type(SEARCH_BAR, targetName);

    await page.keyboard.press("Enter");

    await page.waitForSelector(RESULT_PERSON_NAME);

    const persons = await page.$$eval(RESULT_PERSON_NAME, (elements) => {
      return elements.map((el) => {
        const anchorElement = el as HTMLAnchorElement;
        return {
          name: el.textContent,
          link: anchorElement.href,
        };
      });
    });

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
