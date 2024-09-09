import moment from "moment";
import { formatNumber } from "../../../helpers";
import { responseClient } from "../../../utils";
import { MESSAGE_GET_SUCCESS } from "../../constants";
import { botNotiRequest } from "../../loggers/telegram.log";

export const getBotTelegramHomeowner = async ({
  name_owner,
  address_owner,
  phone_owner,
  time_owner,
  description_owner,
  require_owner,
  primary_owner,
  salary_owner,
}) => {
  botNotiRequest(
    `🔥 HOMEEASE - ${moment().format("DD/MM/YYYY")} 🔥
-----------------------------
CHỦ NHÀ
-----------------------------
👉 Tên:  ${name_owner}
👉 Địa chỉ: ${address_owner}
👉 SĐT: ${phone_owner}
👉 Thời gian làm việc: ${time_owner}
👉 Mô tả công việc: ${description_owner}
👉 Yêu cầu: ${require_owner}
👉 Ưu tiên: ${primary_owner}
👉 Mức lương: ${salary_owner}
`
  );

  return responseClient({
    message: MESSAGE_GET_SUCCESS,
    status: "1",
    data: { bot: "success" },
  });
};

export const getBotTelegramHousekeeper = async ({
  name_housekeeper,
  year_housekeeper,
  religion_housekeeper,
  address_housekeeper,
  phone_housekeeper,
  phone_relative_housekeeper,
  where_work_housekeeper,
  level_housekeeper,
  health_housekeeper,
  family_housekeeper,
  skill_housekeeper,
  desire_housekeeper,
  salary_housekeeper,
}) => {
  botNotiRequest(
    `🔥 HOMEEASE - ${moment().format("DD/MM/YYYY")} 🔥
-----------------------------
GIÚP VIỆC
-----------------------------
👉 Tên:  ${name_housekeeper}
👉 Năm sinh: ${year_housekeeper}
👉 Tôn giáo: ${religion_housekeeper}
👉 Quê quán: ${address_housekeeper}
👉 SĐT: ${phone_housekeeper}
👉 SĐT người thân: ${phone_relative_housekeeper}
👉 Làm được tại đâu: ${where_work_housekeeper}
👉 Trình độ học vấn: ${level_housekeeper}
👉 Sức khoẻ: ${health_housekeeper}
👉 Gia đình: ${family_housekeeper}
👉 Mong muốn công việc: ${skill_housekeeper}
👉 Chuyên môn: ${desire_housekeeper}
👉 Mức lương mong muốn: ${salary_housekeeper}
`
  );

  return responseClient({
    message: MESSAGE_GET_SUCCESS,
    status: "1",
    data: { bot: "success" },
  });
};
