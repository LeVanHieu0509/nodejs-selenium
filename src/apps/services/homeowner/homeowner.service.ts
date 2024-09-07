import { getCustomRepository } from "typeorm";
import { responseClient } from "../../../utils";
import {
  MESSAGE_ADD_FAILED,
  MESSAGE_ADD_SUCCESS,
  MESSAGE_NOTFOUND,
  MESSAGE_PHONE_NUMBER_INVALID,
  MESSAGE_UPDATE_SUCCESS,
} from "../../constants";
import { HomeOwner } from "../../modules/entities/homeowner.entity";
import { HomeownerRepository } from "../../repositories/homeowner.reposiotory";
import { canSubmitFormHomeOwner, getHomeOwnerById, getHomeOwnerByPhone } from "./repo.service";
import { validatePhone } from "../../../helpers";

export const createHomeowner = async (data: HomeOwner) => {
  //1. User nhập input
  //2. 1 Chủ có thể submit nhiều lần.
  //3. Làm sao để chặn được user spam nhiều lần
  //4. Dựa vào số điện thoại để check rate limit date => sau 1p mới được submit

  let {
    name_owner,
    address_owner,
    phone_owner,
    time_owner,
    description_owner,
    require_owner,
    primary_owner,
    salary_owner,
    image_owner,
  } = data ?? {};
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

  const product = homeownerRepository.create({
    image_owner,
    name_owner,
    address_owner,
    phone_owner,
    time_owner,
    description_owner,
    require_owner,
    primary_owner,
    salary_owner,
    status: "NEW",
  });

  const newProduct = await homeownerRepository.save(product);

  if (newProduct) {
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
