import { responseClient } from "../../../utils";
import { MESSAGE_GET_SUCCESS } from "../../constants";
import { botNotiRequest } from "../../loggers/telegram.log";

export const getBotTelegramService = async (req: Request) => {
  const { name, address, phone, email, partner, note } = req.body as any;

  botNotiRequest(
    `🔥 HOMEEASE - Dịch vụ kết nối việc làm trực tuyến 🔥
------------------------------ ${partner} -----------------------------
👉 Tên:  ${name}
👉 Địa chỉ: ${address}
👉 SĐT: ${phone}
👉 Email: ${email}
👉 Mô tả: ${note}`
  );

  return responseClient({
    message: MESSAGE_GET_SUCCESS,
    status: "1",
    data: { bot: "success" },
  });
};
