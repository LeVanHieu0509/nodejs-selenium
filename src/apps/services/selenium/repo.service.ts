import { cloneDeep } from "lodash";
import path from "path";
import { Browser, Builder, By, Key, until, WebDriver, WebElement } from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome";
import { exec } from "child_process";

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const uploadImage = async (driver: WebDriver, imagePath: string) => {
  try {
    // Tìm phần tử "Ảnh" và nhấp vào nó
    const imageButton = await driver.wait(until.elementLocated(By.xpath("//div[@aria-label='Photos']")), 10000);
    await imageButton.click();

    // Giả sử sau khi nhấp vào, một hộp thoại chọn tệp xuất hiện
    // Tìm phần tử input kiểu file (nếu có)
    const fileInput = await driver.wait(until.elementLocated(By.css('input[type="file"]')), 10000);

    // Gửi đường dẫn tệp đến phần tử input
    await fileInput.sendKeys(imagePath);

    console.log("Ảnh đã được tải lên thành công.");
  } catch (error) {
    console.error("Lỗi khi tải lên ảnh:", error);
  }
};

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
    const loginSubmit = await waitForElement(
      driver,
      By.xpath(
        "//div[@data-bloks-name='bk.components.Flexbox' and @style='pointer-events: inherit; height: 100%; width: 100%;']//div[@data-bloks-name='bk.components.Flexbox' and @style='pointer-events: none; opacity: 1; align-items: center; flex-direction: row; justify-content: center;']//span[@data-bloks-name='bk.components.TextSpan']"
      )
    );
    await loginSubmit.click();
    await delay(2000);

    // Tìm phần tử 'Lúc khác'
    const noSaveAccount = await waitForElement(
      driver,
      By.xpath(
        "//div[@data-bloks-name='bk.components.Flexbox' and @class='wbloks_1' and contains(@style, 'pointer-events: none; opacity: 1; height: 44px; min-width: 44px; flex-grow: 1; padding-left: 20px; padding-right: 20px; background: rgba(255, 255, 255, 0); border: 1px solid rgb(203, 210, 217); border-radius: 22px; align-items: center; flex-direction: row; justify-content: center;')]"
      )
    );

    await noSaveAccount.click();
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
  } catch (e) {}
}

export const postToGroup = async (driver: WebDriver, content: string, files: string) => {
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
    const textBoxEl = await waitForElement(
      driver,
      By.xpath(
        "//div[@data-mcomponent='MContainer' and @data-type='container']//div[@role='button' and @data-mcomponent='ServerTextArea' and @data-type='text']"
      ),
      10000
    );

    await driver.executeScript("arguments[0].click();", textBoxEl);

    // Chờ và nhập nội dung vào textarea
    await delay(3000); // Đợi một chút trước khi tìm textarea
    const textareaEl = await driver.wait(until.elementLocated(By.css("textarea.textbox")), 10000);

    if (textareaEl) {
      await driver.executeScript("arguments[0].value = arguments[1];", textareaEl, content);
    } else {
      console.error("Textarea not found");
    }

    // Thực hiện kéo và thả
    for (const file of files) {
      let f = cloneDeep(file) as any;
      const imagePath = path.resolve(__dirname, `/Users/hieulevan/Desktop/${f.fileName}`);
      await uploadImage(driver, imagePath);
    }

    //Tìm phần tử cha dựa trên phần tử con có chứa văn bản 'ĐĂNG'
    const buttonEl = await waitForElement(driver, By.xpath("//div[@aria-label='POST']"), 10000);
    const parentbuttonEl = await buttonEl.findElement(By.xpath(".."));
    await parentbuttonEl.click();
    return true;
  } catch (e) {
    console.log("Lỗi khi tìm kiếm hoặc nhấp vào phần tử:", e);

    return false;
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
    "--disable-popup-blocking",
    "--disable-notifications",
    "--disable-infobars"
  );
  options.addArguments(
    "user-agent=Mozilla/5.0 (iPhone; CPU iPhone OS 15_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/98.0.4758.85 Mobile/15E148 Safari/604.1"
  );

  const driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build();
  return driver;
}
