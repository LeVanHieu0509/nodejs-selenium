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
  await driver.executeScript(`
    window.onbeforeunload = function(e) {
      if (window.location.href.includes('m.facebook.com')) {
        window.location.href = window.location.href.replace('m.facebook.com', 'mbasic.facebook.com');
      }
    };
  `);

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

    const loginSubmit = await waitForElement(driver, By.xpath("//div[@role='button' and @aria-label='Log in']"), 1000);

    if (loginSubmit) {
      await loginSubmit.click();
    } else {
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

      if (noSaveAccount) {
        await noSaveAccount.click();
      } else {
        const noSaveAccount1 = await waitForElement(
          driver,
          By.xpath("//div[@role='button' and @aria-label='Not now']")
        );

        if (noSaveAccount1) {
          await noSaveAccount.click();
        }
      }
    }

    return true;
  } catch (e) {
    console.error("Có lỗi xảy ra:", e);
    return false;
  }
};

export const switchToFanPage = async ({
  driver,
  name = "HomeEase - Nền Tảng Kết Nối Việc Làm Toàn Quốc",
}: {
  driver: WebDriver;
  name?: string;
}) => {
  try {
    delay(4000);
    // await driver.get("https://m.facebook.com/profile.php?id=61564627061497");
    await driver.get("https://www.facebook.com/JunnailHanQuoc");

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
    // Ẩn pseudo-elements bằng cách chỉnh sửa CSS của phần tử cha
    await driver.executeScript(`
      const elements = document.querySelectorAll('.bg-s3::before');
      elements.forEach(el => el.style.display = 'none');
    `);
    delay(3000);
    const element = await driver.findElement(
      By.xpath('//div[contains(text(), "HomeEase - Nền Tảng Kết Nối Việc Làm Toàn Quốc")]')
    );
    // const element = await driver.findElement(By.xpath('//div[contains(text(), "JUN NAIL")]'));
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
        const imagePath = path.resolve(__dirname, `/Users/hieulevan/Downloads/${f.fileName}`);
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
    // Chờ cho phần tử xuất hiện và tìm theo XPath

    let joinGroupButton = await waitForElement(
      driver,
      By.xpath('//div[@role="button" and @aria-label="Join group"]'),
      10000
    );

    if (joinGroupButton) {
      // Thực hiện click vào nút Join group
      await joinGroupButton.click();
    } else {
      let joinGroupButton = await waitForElement(
        driver,
        By.xpath('//div[@role="button" and @aria-label="Tham gia nhóm"]'),
        10000
      );
      await joinGroupButton.click();
    }

    let element = await waitForElement(driver, By.xpath("//div[text()='Write something...']"), 10000);
    let element1 = await waitForElement(driver, By.xpath('//div[contains(text(), "Bạn viết gì đi...")]'), 10000);

    if (element) {
      await driver.executeScript("arguments[0].click();", element);
    }
    if (element1) {
      await driver.executeScript("arguments[0].click();", element1);
    }

    const xc_message = await waitForElement(
      driver,
      By.xpath("//div[@role='button' and @aria-label='Write something' and @class='m']"),
      10000
    );
    const xc_message1 = await waitForElement(
      driver,
      By.xpath('//div[@role="button" and contains(@aria-label, "Bạn viết gì đi")]'),
      10000
    );

    if (xc_message) {
      await xc_message.click();
    }

    if (xc_message1) {
      await xc_message.click();
    }
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

    await driver.sleep(2000);
    const view_post = await waitForElement(
      driver,
      By.xpath(
        '//div[@tabindex="0" and @data-focusable="true" and @data-mcomponent="MContainer" and contains(@class, "nb") and @data-type="container" and div[@role="button" and @aria-label="POST"]]'
      ),
      10000
    );
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
  let divide = getRandomUserAgentMobile();

  console.log({ divide });
  // Thêm các tham số cấu hình cho Chrome
  options.addArguments(
    "--lang=vi",
    // "--incognito",
    "window-size=500,1000",
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
    `--user-agent=${divide}`,
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

export async function getDTSGToken() {
  const options = new chrome.Options();

  // Thêm các tham số cấu hình cho Chrome
  options.addArguments(
    "--lang=vi",
    "--headless",
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

  // Tạo đối tượng WebDriver với các tùy chọn đã cấu hình
  const driver = new Builder().forBrowser("chrome").setChromeOptions(options).build();

  try {
    await driver.get("https://m.facebook.com");
    await loginAccount(driver, "levanhieu.hex@gmail.com", "05092001");

    // Mở trang nhóm Facebook
    await driver.get("https://www.facebook.com/groups/feed/");
    await driver.sleep(2000);
    // Lấy mã nguồn của trang
    const pageSource = await driver.getPageSource();

    const initDtsgMatch = pageSource.match(/"initDtsg":"(.*?)"/);
    const token = initDtsgMatch ? initDtsgMatch[1] : null;

    // Lấy tất cả cookie từ trình duyệt
    let cookies = await driver.manage().getCookies();

    // Chuyển đổi mảng cookies thành một đối tượng duy nhất
    const convertCookie = cookies.reduce((acc, item) => {
      acc[item.name] = item.value;
      return acc;
    }, {});

    const cooki = {
      datr: "93emZuYtC3monePxe-stds5b",
      sb: "93emZvXYIcFK7aqjsRFZu1NW",
      ps_l: "1",
      ps_n: "1",
      wl_cbv: "v2;client_version:2587;timestamp:1723265759",
      locale: "vi_VN",
      ar_debug: "1",
      usida: "eyJ2ZXIiOjEsImlkIjoiQXNrM2Fma2R2NXlpaSIsInRpbWUiOjE3MjY3OTg3MzZ9",
      c_user: "100083130741074",
      xs: "30:MybWFK540QlVng:2:1726801127:-1:6308",
      fr: "16hJAQRry2ytNuFma.AWWaKKrpH4HBvXmgeH1hEt9gV2U.Bm7NtO..AAA.0.0.Bm7OkK.AWX23s7iXR4",
      wd: "1240x1491",
      presence: 'C{"t3":[],"utc3":1726802212190,"v":1}',
      ...convertCookie,
    };

    const cookieString = Object.entries(cooki)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value) as string)}`)
      .join("; ");

    return { token, cookie: cookieString };
  } finally {
    await driver.quit();
  }
}

export function getCookieValue(cookieName, data) {
  const cookies = data.split("; ");
  const cookie = cookies.find((c) => c.startsWith(cookieName + "="));
  return cookie ? cookie.split("=")[1] : null;
}

export function getRandomUserAgent() {
  const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Firefox/56.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/602.3.12 (KHTML, like Gecko) Version/10.1.2 Safari/602.3.12",
    "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.68 Mobile Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1",
  ];

  const randomIndex = Math.floor(Math.random() * userAgents.length);
  return userAgents[randomIndex];
}

export function getRandomUserAgentMobile() {
  const userAgents = [
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/98.0.4758.85 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/87.0.4280.163 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (iPod; CPU iPhone OS 14_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/87.0.4280.163 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/87.0.4280.163 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/80.0.3987.95 Mobile/15E148 Safari/604.1",
    // Thêm các user-agent khác vào đây
  ];

  const randomIndex = Math.floor(Math.random() * userAgents.length);

  console.log({ randomIndex });
  return userAgents[randomIndex];
}
