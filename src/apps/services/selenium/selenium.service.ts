// fixed just for testing, use moment();
import { createDriver, delay, loginAccount, postToGroup } from "./repo.service";

// Hàm để chuyển đổi các ký tự ngoài BMP thành mã escape



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
        console.log({email:  data[index].email})
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
      data: "",
      message: "Not Found",
    };
  }
};
