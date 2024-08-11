// fixed just for testing, use moment();
import { createDriver, delay, loginAccount, postToGroup } from "./repo.service";

// Hàm để chuyển đổi các ký tự ngoài BMP thành mã escape

const accounts = [
  {
    id: 1,
    email: "lvh2k1",
    pass: "06092001",
    text: `🌟 Cô Hằng – Chuyên Gia Chăm Sóc Trẻ Em
    🌟Kinh nghiệm: 4 năm Kỹ năng nổi bật: Chăm sóc trẻ em từ sơ sinh đến tuổi đi học, bao gồm học tập, vui chơi và đảm bảo an toàn.🥰
    Kỹ năng giao tiếp tốt, tạo ra môi trường học tập và vui chơi tích cực. Sáng tạo trong việc tổ chức các hoạt động phát triển trí tuệ và thể chất cho trẻ.🥰
    Giới thiệu: Cô Hằng là một người mẹ nhiệt tình và tận tụy. Cô không chỉ chăm sóc trẻ em mà còn là người bạn đồng hành đáng tin cậy, giúp trẻ phát triển kỹ năng và tư duy. 🥰
    Nhiều phụ huynh đã đánh giá cao sự tận tâm và khả năng chăm sóc chu đáo của cô Hằng.🥰
    ☎️☎️Hotline trao đổi công việc: 038 708 4647 Em PHÚC
    #giupviecnha #chambe #bbb`,
    listGroup: ["126669644633121", "1681510115202510", "985358911516857", "289783688341983"],
  },
  {
    id: 2,
    email: "levanhieu.hex@gmail.com",
    pass: "05092001",
    listGroup: ["1905892903072440"],
    text: `🌟 Cô Hằng – Chuyên Gia Chăm Sóc Trẻ Em
    🌟Kinh nghiệm: 4 năm Kỹ năng nổi bật: Chăm sóc trẻ em từ sơ sinh đến tuổi đi học, bao gồm học tập, vui chơi và đảm bảo an toàn.🥰`,
  },
];

interface PostData {
  email: string;
  pass: string;
  listGroup: string[];
  text: string;
  files: string;
}

export interface TaskData {
  data: PostData[];
}

export const postToGroupFacebook = async ({ data }: TaskData) => {
  let state = "init";
  let count = data.length;
  try {
    const createAndExecuteTask = async (index) => {
      const driver = await createDriver();

      if (!driver) {
        throw new Error("Vui lòng thử lại! lỗi driver rồi");
      }

      try {
        await driver.get("https://mbasic.facebook.com");
        await delay(2000);
        await loginAccount(driver, data[index].email, data[index].pass);

        for (const idGroup of data[index].listGroup) {
          await delay(2000);
          await driver.get(`https://mbasic.facebook.com/groups/${idGroup}`);
          const postContent = data[index].text;
          const newConcatContent = postContent.concat(` #gioi_thieu_viec_lam_duc_phuc_${idGroup}`)
          const files = data[index].files;

          await postToGroup(driver, newConcatContent, files);
        }

        state = "done";
      } finally {
        await driver.quit();
      }
    };

    const tasks = Array.from({ length: count }, (_, index) => createAndExecuteTask(index));

    await Promise.all(tasks);

    if (state == "done") {
      return {
        status: "1",
        data: state,
        message: "Success",
      };
    } else {
      return {
        status: "1",
        data: state,
        message: "Success",
      };
    }
  } catch (e) {
    return {
      status: "-1",
      data: e,
      message: "Not Found",
    };
  }
};
