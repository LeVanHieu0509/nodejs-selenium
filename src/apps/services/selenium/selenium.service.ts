// fixed just for testing, use moment();
import { crawlDataGroupId } from "../../../services/api";
import { createDriver, delay, loginAccount, postToGroup, postToGroupPageM, switchToFanPage } from "./repo.service";

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
        const statusLogin = await loginAccount(driver, data[index].email, data[index].pass);

        if (!statusLogin) {
          await loginAccount(driver, data[index].email, data[index].pass);
        }

        for (const idGroup of data[index].listGroup) {
          await delay(5000);

          await driver.get(`https://mbasic.facebook.com/groups/${idGroup}`);
          const postContent = data[index].text;
          const newConcatContent = postContent.concat(`
              #giupviecnha #chambe #giupviecnhaducphuc #giupviecnhahochiminh 
              #HomeEase_Nen_Tang_Ket_Noi_Viec_Lam_Toan_Quoc #${idGroup}
              🌟 Website: https://homeease.com.vn/`);

          const files = data[index].files;
          await postToGroup(driver, postContent, files, "ca-nhan");
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

export const postFanPageToGroupFacebook = async ({ data }: TaskData) => {
  let state = "init";
  let count = data.length;
  try {
    const createAndExecuteTask = async (index) => {
      const driver = await createDriver();

      if (!driver) {
        throw new Error("Vui lòng thử lại! lỗi driver rồi");
      }

      try {
        await driver.manage().deleteAllCookies();
        await driver.get("https://m.facebook.com");
        await delay(2000);
        await loginAccount(driver, data[index].email, data[index].pass);
        await switchToFanPage(driver);

        for (const idGroup of data[index].listGroup) {
          await delay(2000);

          await driver.navigate().to(`https://m.facebook.com/groups/${idGroup}/`);
          await driver.navigate().to("https://m.facebook.com/");
          await driver.navigate().to(`https://m.facebook.com/groups/${idGroup}/`);

          await delay(2000);
          const postContent = data[index].text;
          const newConcatContent = postContent.concat(`
🌟 Website: https://homeease.com.vn/`);
          const files = data[index].files;

          await postToGroupPageM(driver, postContent, files, "fanpage");
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

export const postToGetIdGroup = async (body) => {
  let i = 0;
  let stop = false;
  let result = [];

  const dataFormat = (result) => {
    const data = result.data.serpResponse.results.edges;

    const finalData = data
      .map((item) => {
        let dataGroup = item.relay_rendering_strategy.view_model;
        let checkMember = dataGroup.primary_snippet_text_with_entities.text.split("·")[1].split(" ")[1];

        return {
          id: dataGroup.profile.id,
          name: dataGroup.profile.name,
          member: checkMember,
        };
      })
      .filter((i) => i.member.includes("K") && +i.member.slice(0, -1) > 10);

    return finalData;
  };
  let endCursorInit = null;

  while (i < 10) {
    const { data, endCursor, hasNextPage } = await crawlDataGroupId({ cursor: endCursorInit, searchText: body.data });

    const formatD = dataFormat(data);

    if (hasNextPage) {
      endCursorInit = endCursor;
      result.push(...formatD);
      i++;
    } else {
      stop = true;
    }
  }

  if (result) {
    return {
      status: "1",
      data: result,
      message: "Success",
    };
  } else {
    return {
      status: "-1",
      data: result,
      message: "failed",
    };
  }
};
// cudanopalgardenthuduc
// cudanchungcusaigonintela
// khudancuhanhphuc
// d1mensionzenity
// 405981247432642
// hcm0002
// salevinhomes1
// 2258504740844682
// 469864193182841
