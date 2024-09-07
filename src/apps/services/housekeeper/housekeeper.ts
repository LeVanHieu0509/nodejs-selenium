import { getCustomRepository } from "typeorm";
import { validatePhone } from "../../../helpers";
import { responseClient } from "../../../utils";
import {
  MESSAGE_ADD_FAILED,
  MESSAGE_ADD_SUCCESS,
  MESSAGE_NOTFOUND,
  MESSAGE_PHONE_NUMBER_INVALID,
  MESSAGE_UPDATE_FAILED,
  MESSAGE_UPDATE_SUCCESS,
} from "../../constants";
import { HouseKeeper } from "../../modules/entities/housekeeper.entity";
import { HouseKeeperRepository } from "../../repositories/housekeeper.reposiotory";
import { canSubmitFormHousekeeper, getHousekeeperById, getHousekeeperByPhone } from "./repo.service";
import { getBotTelegramHousekeeper } from "../bot/bot.service";

export const createHousekeeper = async (data: HouseKeeper) => {
  //1. User nhập input
  //2. 1 Chủ có thể submit nhiều lần.
  //3. Làm sao để chặn được user spam nhiều lần
  //4. Dựa vào số điện thoại để check rate limit date => sau 1p mới được submit

  let { phone_housekeeper, ...rest } = data ?? {};
  const foundHousekeeper = await getHousekeeperByPhone({ phone_housekeeper });
  const housekeeperRepository = getCustomRepository(HouseKeeperRepository);

  if (!phone_housekeeper || !validatePhone(phone_housekeeper)) {
    return responseClient({
      status: "-1",
      message: MESSAGE_PHONE_NUMBER_INVALID,
    });
  }

  // Check if the user is allowed to submit the form (based on 30 seconds limit)
  const { show, time } = (await canSubmitFormHousekeeper(phone_housekeeper)) ?? {};

  if (foundHousekeeper && !show) {
    return responseClient({
      status: "-1",
      data: time,
      message: `Vui lòng đợi ${time} giây, để tiếp tục gửi thông tin!`,
    });
  }

  if (foundHousekeeper && show) {
    const result = await housekeeperRepository.update(
      {
        id: foundHousekeeper.id,
      },
      {
        ...rest,
      }
    );

    if (result.affected == 1) {
      return responseClient({
        status: "1",
        message: MESSAGE_UPDATE_SUCCESS,
      });
    } else {
      return responseClient({
        status: "-1",
        message: MESSAGE_UPDATE_FAILED,
      });
    }
  }

  if (!foundHousekeeper) {
    const housekeeper = housekeeperRepository.create({
      ...rest,
      phone_housekeeper: phone_housekeeper,
      status: "NEW",
    });

    const newProduct = await housekeeperRepository.save(housekeeper);

    if (newProduct) {
      await getBotTelegramHousekeeper(data);
      return responseClient({
        status: "1",
        data: newProduct,
        message: MESSAGE_ADD_SUCCESS,
      });
    } else {
      return responseClient({
        status: "-1",
        message: MESSAGE_ADD_FAILED,
      });
    }
  }
};

export const updateHousekeeper = async (data) => {
  const { id, ...rest } = data ?? {};
  const housekeeperRepository = getCustomRepository(HouseKeeperRepository);
  const foundProduct = await getHousekeeperById({ id });

  if (foundProduct) {
    const result = await housekeeperRepository.update(
      {
        id,
      },
      {
        ...rest,
      }
    );

    return responseClient({
      status: result.affected,
      message: MESSAGE_UPDATE_SUCCESS,
    });
  } else {
    return responseClient({
      status: "-1",
      message: MESSAGE_NOTFOUND,
    });
  }
};
