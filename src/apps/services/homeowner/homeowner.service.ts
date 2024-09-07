import { getCustomRepository } from "typeorm";
import { responseClient } from "../../../utils";
import {
  MESSAGE_ADD_FAILED,
  MESSAGE_ADD_SUCCESS,
  MESSAGE_NOTFOUND,
  MESSAGE_PHONE_NUMBER_INVALID,
  MESSAGE_UPDATE_FAILED,
  MESSAGE_UPDATE_SUCCESS,
} from "../../constants";
import { HomeOwner } from "../../modules/entities/homeowner.entity";
import { HomeownerRepository } from "../../repositories/homeowner.reposiotory";
import { canSubmitFormHomeOwner, getHomeOwnerById, getHomeOwnerByPhone } from "./repo.service";
import { validatePhone } from "../../../helpers";
import { getBotTelegramHomeowner } from "../bot/bot.service";

export const createHomeowner = async (data: HomeOwner) => {
  let { phone_owner, ...rest } = data ?? {};
  const foundHomeowner = await getHomeOwnerByPhone({ phone_owner });
  const homeownerRepository = getCustomRepository(HomeownerRepository);

  if (!phone_owner || !validatePhone(phone_owner)) {
    return responseClient({
      status: "-1",
      message: MESSAGE_PHONE_NUMBER_INVALID,
    });
  }

  // Check if the user is allowed to submit the form (based on 30 seconds limit)
  const { show, time } = (await canSubmitFormHomeOwner(phone_owner)) ?? {};

  if (foundHomeowner && !show) {
    return responseClient({
      status: "-1",
      data: time,
      message: `Vui lòng đợi ${time} giây, để tiếp tục gửi thông tin!`,
    });
  }

  // update if exist phone number
  if (foundHomeowner && show) {
    const result = await homeownerRepository.update(
      {
        id: foundHomeowner.id,
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

  //create new
  if (!foundHomeowner) {
    const product = homeownerRepository.create({
      ...rest,
      phone_owner,
      status: "NEW",
    });

    const newProduct = await homeownerRepository.save(product);

    if (newProduct) {
      await getBotTelegramHomeowner(data);

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

export const updateProduct = async (data) => {
  const { id, rest } = data ?? {};
  const homeRepository = getCustomRepository(HomeownerRepository);
  const foundProduct = await getHomeOwnerById({ id });

  if (foundProduct) {
    const result = await homeRepository.update(
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
