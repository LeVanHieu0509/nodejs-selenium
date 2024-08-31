import { cloneDeep } from "lodash";
import path from "path";
import { Builder, By, until, WebDriver, WebElement } from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome";

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const uploadImage = async (driver: WebDriver, imagePath: string) => {
  try {
    const view_photo = await driver.wait(until.elementLocated(By.name("view_photo")), 10000);
    await view_photo.click();

    const fileInput = await driver.wait(until.elementLocated(By.css('input[type="file"]')), 10000);
    await fileInput.sendKeys(imagePath);

    const add_photo_done = await driver.wait(until.elementLocated(By.name("add_photo_done")), 10000);
    await add_photo_done.click();
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
    const passInput = await waitForElement(driver, By.name("pass"));
    await driver.wait(until.elementIsVisible(passInput), 10000);
    await passInput.sendKeys(pass);

    // Nhấp vào nút đăng nhập
    const loginSubmit = await waitForElement(driver, By.name("login"));
    await loginSubmit.click();

    // Tìm phần tử 'Lúc khác'
    const noSaveAccount = await waitForElement(driver, By.xpath("//a[contains(@href, '/login/save-device/cancel/')]"));

    await noSaveAccount.click();
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
    const view_overview = await waitForElement(driver, By.name("view_overview"), 10000);
    await view_overview.click();

    const xc_message = await waitForElement(driver, By.name("xc_message"), 10000);
    await xc_message.click();
    await driver.executeScript("arguments[0].value = arguments[1];", xc_message, content);

    if(files){
      for (const file of files) {
        let f = cloneDeep(file) as any;
        const imagePath = path.resolve(__dirname, `C:/Users/Admin/Downloads/${f.fileName}`);
        await uploadImage(driver, imagePath);
      }
    }
    
    delay(5000)
    const view_post = await waitForElement(driver, By.name("view_post"), 10000);
    await view_post.click();
    console.log("Dang thành cong");
    console.log("-----------------------------------------------------------------");

    return true;
  } catch (e) {
    console.log("Lỗi khi tìm kiếm hoặc nhấp vào phần tử:", e);

    return false;
  }
};

export async function createDriver(): Promise<WebDriver> {
  const options = new chrome.Options();

  // Thêm các tham số cấu hình cho Chrome
  options.addArguments(
    "--lang=vi",
    // "--incognito",
    "window-size=200,450",
    "--disable-3d-apis",
    "--disable-background-networking",
    "--disable-bundled-ppapi-flash",
    "--disable-client-side-phishing-detection",
    "--disable-default-apps",
    "--disable-hang-monitor",
    "--disable-prompt-on-repost",
    "--disable-sync",
    "--disable-webgl",
    "--enable-blink-features=ShadowDOMV0",
    "--enable-logging",
    "--disable-notifications",
    "--no-sandbox",
    "--disable-gpu",
    "--disable-dev-shm-usage",
    "--disable-web-security",
    "--disable-rtc-smoothness-algorithm",
    "--disable-webrtc-hw-decoding",
    "--disable-webrtc-hw-encoding",
    "--disable-webrtc-multiple-routes",
    "--disable-webrtc-hw-vp8-encoding",
    "--enforce-webrtc-ip-permission-check",
    "--force-webrtc-ip-handling-policy",
    "--ignore-certificate-errors",
    "--disable-infobars",
    "--disable-blink-features=BlockCredentialedSubresources",
    "--disable-popup-blocking",
    "--mute-audio",
    "--user-agent=Mozilla/5.0 (iPhone; CPU iPhone OS 15_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/98.0.4758.85 Mobile/15E148 Safari/604.1",
    "--disable-blink-features=AutomationControlled",
    "--blink-settings=imagesEnabled=false"
  );
  // options.addArguments(
  //   "user-agent=Mozilla/5.0 (iPhone; CPU iPhone OS 15_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/98.0.4758.85 Mobile/15E148 Safari/604.1"
  // );
  // Loại bỏ tùy chọn 'enable-automation'
  options.excludeSwitches.apply(options, ["enable-automation"]);

  // Thiết lập tùy chọn profile
  options.setUserPreferences({
    credentials_enable_service: false,
  });

  // Tạo đối tượng WebDriver với các tùy chọn đã cấu hình
  const driver = new Builder().forBrowser("chrome").setChromeOptions(options).build();

  // Thiết lập thời gian chờ đợi ngầm định
  await driver.manage().setTimeouts({
    implicit: 5000,
    pageLoad: 60000,
  });

  return driver;
}
