import { cloneDeep } from "lodash";
import path from "path";
import { Builder, By, until, WebDriver, WebElement } from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome";

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const uploadImage = async (driver: WebDriver, imagePath: string, type: string) => {
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

    const loginSubmit1 = await waitForElement(driver, By.xpath("//div[@role='button' and @aria-label='Log in']"), 1000);
    const loginSubmit2 = await waitForElement(driver, By.xpath("//div[@role='button' and @aria-label='Đăng nhập']"), 1000);
    
    if (loginSubmit1) {
      await loginSubmit1.click();
    } else if(loginSubmit2){
      await loginSubmit2.click();
    } else{
      const loginSubmit = await waitForElement(driver, By.name("login"), 1000);
      await loginSubmit.click();
    }

    // Tìm phần tử 'Lúc khác'
    const noSaveAccount = await waitForElement(
      driver,
      By.xpath("//a[contains(@href, '/login/save-device/cancel/')]"),
      1000
    );

    if (noSaveAccount) {
      await noSaveAccount.click();
    } else {
      const noSaveAccount = await waitForElement(driver, By.xpath("//div[@role='button' and @aria-label='Lúc khác']"));
      await noSaveAccount.click();
    }

    return true;
  } catch (e) {
    console.error("Có lỗi xảy ra:", e);
    return false;
  }
};

export const switchToFanPage = async (driver: WebDriver) => {
  try {
    delay(4000);
    await driver.get("https://m.facebook.com/profile.php?id=61564627061497");
    delay(4000);

    const switchProfiles = await waitForElement(
      driver,
      By.xpath("//div[@role='button' and @aria-label='Chuyển trang cá nhân']"),
      10000
    );
    if (switchProfiles) {
      await switchProfiles.click();
    } else {
      const switchProfiles = await waitForElement(
        driver,
        By.xpath("//div[@role='button' and @data-type='container' and contains(., 'Switch Profiles')]"),
        1000
      );
      await switchProfiles.click();
    }

    await driver.executeScript(`
      const elements = document.querySelectorAll('.bg-s3::before');
      elements.forEach(el => el.style.display = 'none');
    `);
    delay(3000);
    const element = await driver.findElement(
      By.xpath('//div[contains(text(), "HomeEase - Nền Tảng Kết Nối Việc Làm Toàn Quốc")]')
    );
    await driver.actions().move({ origin: element }).click().perform();

    delay(5000);
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

export const postToGroup = async (driver: WebDriver, content: string, files: string, type?: string) => {
  try {
    const view_overview = await waitForElement(driver, By.name("view_overview"), 10000);
    await view_overview.click();

    const xc_message = await waitForElement(driver, By.name("xc_message"), 10000);
    await xc_message.click();
    await driver.executeScript("arguments[0].value = arguments[1];", xc_message, content);

    if (files) {
      for (const file of files) {
        let f = cloneDeep(file) as any;
        const imagePath = path.resolve(__dirname, `/Downloads/${f.fileName}`);
        await uploadImage(driver, imagePath, type);
      }
    }

    delay(5000);
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

export const postToGroupPageM = async (driver: WebDriver, content: string, files: string, type?: string) => {
  try {
    const element = await driver.findElement(By.xpath("//div[text()='Write something...']"));
    await driver.executeScript("arguments[0].click();", element);

    const xc_message = await waitForElement(
      driver,
      By.xpath("//div[@role='button' and @aria-label='Write something' and @class='m']"),
      10000
    );
    await xc_message.click();
    delay(2000);

    // Locate the target element

    // Check if the element is an input or textarea
    const containerXPath = "//div[@class='textbox-container with-mentions']";
    const container = await driver.wait(until.elementLocated(By.xpath(containerXPath)), 10000);
    await driver.wait(until.elementIsVisible(container), 10000);

    // Locate the textarea inside the container
    const textarea = await driver.findElement(By.css(".textbox-container.with-mentions textarea.textbox"));

    // Clear any existing value
    await textarea.clear();

    // Set the new value
    // await textarea.sendKeys(content);
    await driver.executeScript("arguments[0].value = arguments[1];", textarea, content);

    // if (files) {
    //   for (const file of files) {
    //     let f = cloneDeep(file) as any;
    //     const imagePath = path.resolve(__dirname, `Downloads/${f.fileName}`);
    //     await uploadImage(driver, imagePath, type);
    //   }
    // }

    delay(5000);
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
