import path from "path";
import { Browser, Builder, By, until, WebDriver, WebElement } from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome";

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const loginAccount = async (driver: WebDriver, email: string, pass: string) => {
  try {
    // Nhập email
    const emailInput = await waitForElement(driver, By.id("m_login_email"));
    await driver.wait(until.elementIsVisible(emailInput), 10000);
    await emailInput.sendKeys(email);

    // Nhập mật khẩu
    const passInput = await waitForElement(driver, By.id("m_login_password"));
    await driver.wait(until.elementIsVisible(passInput), 10000);
    await passInput.sendKeys(pass);

    // Nhấp vào nút đăng nhập
    const loginSubmit = await waitForElement(driver, By.xpath("//span[contains(.,'Log in')]"));
    const parentElement = await loginSubmit.findElement(By.xpath(".."));
    await parentElement.click();
    await delay(5000);

    // Tìm phần tử 'Lúc khác'
    const noSaveAccount = await waitForElement(driver, By.xpath("//div[@aria-label='Lúc khác']"));

    const parentbuttonEl = await noSaveAccount.findElement(By.xpath(".."));
    await parentbuttonEl.click();
    await delay(2000);
  } catch (e) {
    console.error("Có lỗi xảy ra:", e);
  }
};

export async function waitForElement(driver: WebDriver, locator: By, timeout: number = 20000): Promise<WebElement> {
  try {
    await driver.wait(until.elementLocated(locator), timeout);
    const element = await driver.findElement(locator);
    await driver.wait(until.elementIsVisible(element), timeout);
    return element;
  } catch (e) {
    console.error(`Phần tử với locator ${locator} không được tìm thấy trong khoảng thời gian ${timeout}ms`);
    throw e;
  }
}

export const postToGroup = async (driver: WebDriver, content: string) => {
  try {
    // Sử dụng hàm chờ để tìm phần tử
    await delay(3000);

    const postEl = await waitForElement(
      driver,
      By.xpath("//div[@id='screen-root']/div/div[2]/div[6]/div[2]/div"),
      10000
    );
    await postEl.click();

    // Chờ và click vào text box
    await delay(3000);
    const textBoxEl = await waitForElement(driver, By.xpath("//div[contains(text(),'Bạn viết gì đi')]"), 10000);

    const parentElement = await textBoxEl.findElement(By.xpath("./ancestor::div[@role='button']"));
    await driver.executeScript("arguments[0].click();", parentElement);

    // Chờ và nhập nội dung vào textarea
    await delay(3000); // Đợi một chút trước khi tìm textarea
    const textareaEl = await driver.wait(until.elementLocated(By.css("textarea.textbox")), 10000);

    if (textareaEl) {
      await driver.executeScript("arguments[0].value = arguments[1];", textareaEl, content);
    } else {
      console.error("Textarea not found");
    }
    // Tìm phần tử cha dựa trên phần tử con có chứa văn bản 'ĐĂNG'
    const buttonEl = await waitForElement(driver, By.xpath("//div[@aria-label='ĐĂNG']"), 10000);
    const parentbuttonEl = await buttonEl.findElement(By.xpath(".."));
    await parentbuttonEl.click();
  } catch (e) {
    console.log("Lỗi khi tìm kiếm hoặc nhấp vào phần tử:", e);
  }
};

export async function createDriver(): Promise<WebDriver> {
  const options = new chrome.Options();

  options.addArguments(
    "disable-gpu",
    "no-sandbox",
    "window-size=315,900",
    "--incognito",
    "--lang=vi",
    "disable-popup-blocking",
    "disable-notifications",
    "disable-infobars"
  );
  options.addArguments(
    "user-agent=Mozilla/5.0 (iPhone; CPU iPhone OS 15_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/98.0.4758.85 Mobile/15E148 Safari/604.1"
  );

  const driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build();
  return driver;
}
