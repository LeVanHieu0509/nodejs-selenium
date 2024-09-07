import { getCustomRepository } from "typeorm";
import { HouseKeeperRepository } from "../../repositories/housekeeper.reposiotory";

export const getHousekeeperById = async ({ id }) => {
  const housekeeperRepository = getCustomRepository(HouseKeeperRepository);

  return await housekeeperRepository.findOne({
    where: {
      id,
    },
  });
};

export const getHousekeeperByPhone = async ({ phone_housekeeper }) => {
  const housekeeperRepository = getCustomRepository(HouseKeeperRepository);

  return await housekeeperRepository.findOne({
    where: {
      phone_housekeeper,
    },
  });
};

export const canSubmitFormHousekeeper = async (
  phone_housekeeper: string,
  timeLimit: number = 30
): Promise<{ show: boolean; time?: string }> => {
  const housekeeperRepository = getCustomRepository(HouseKeeperRepository);

  // Fetch the latest submission by this user based on `phone_housekeeper`
  const latestSubmission = await housekeeperRepository.findOne({
    where: {
      phone_housekeeper,
    },
    order: { updatedAt: "DESC" },
  });

  if (!latestSubmission) {
    // If no previous submission exists, allow the submission
    return { show: true };
  }

  // Get the current time
  const currentTime = new Date();
  const submissionTime = new Date(latestSubmission.updatedAt);

  // Calculate time difference in seconds
  const timeDifference = (currentTime.getTime() - submissionTime.getTime()) / 1000;

  // If the time difference is less than the time limit, return false
  if (timeDifference < timeLimit) {
    return { show: false, time: Number(timeLimit - timeDifference).toFixed(0) };
  }

  // If enough time has passed, allow the submission
  return { show: true };
};
