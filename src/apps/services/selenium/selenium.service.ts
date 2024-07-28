// fixed just for testing, use moment();
import { createDriver, delay, loginAccount, postToGroup } from "./repo.service";

// Hàm để chuyển đổi các ký tự ngoài BMP thành mã escape

const data = ["https://m.facebook.com/groups/126669644633121/", "https://m.facebook.com/groups/1905892903072440/"];

const accounts = [
  { email: "lvh2k1", pass: "06092001" },
  { email: "levanhieu.hex@gmail.com", pass: "05092001" },
];

export const autoSelenium = async (count = accounts.length) => {
  let state = "init";

  try {
    const tasks = Array.from({ length: count }, (_, index) =>
      (async () => {
        const driver = await createDriver();

        if (!driver) {
          throw new Error("Vui lòng thử lại! lỗi driver rồi");
        }

        try {
          await driver.get("https://m.facebook.com");
          await delay(2000);

          await loginAccount(driver, accounts[index].email, accounts[index].pass);

          const textToEnter = `🌟 Cô Hằng – Chuyên Gia Chăm Sóc Trẻ Em
          🌟Kinh nghiệm: 4 năm Kỹ năng nổi bật: Chăm sóc trẻ em từ sơ sinh đến tuổi đi học, bao gồm học tập, vui chơi và đảm bảo an toàn.🥰
          Kỹ năng giao tiếp tốt, tạo ra môi trường học tập và vui chơi tích cực. Sáng tạo trong việc tổ chức các hoạt động phát triển trí tuệ và thể chất cho trẻ.🥰
          Giới thiệu: Cô Hằng là một người mẹ nhiệt tình và tận tụy. Cô không chỉ chăm sóc trẻ em mà còn là người bạn đồng hành đáng tin cậy, giúp trẻ phát triển kỹ năng và tư duy. 🥰
          Nhiều phụ huynh đã đánh giá cao sự tận tâm và khả năng chăm sóc chu đáo của cô Hằng.🥰
          ☎️☎️Hotline trao đổi công việc: 038 708 4647 Em PHÚC
          #giupviecnha #chambe #bbb`;

          await driver.get(data[index]);
          await postToGroup(driver, textToEnter);
          state = "done";
        } finally {
          await driver.quit();
        }
      })()
    );

    await Promise.all(tasks);

    return {
      status: "1",
      data: state,
      message: "Success",
    };
  } catch (e) {
    return {
      status: "1-",
      data: e,
      message: "Not Found",
    };
  }
};
