import { getCustomRepository } from "typeorm";
import { ProductsRepository } from "../../repositories/products.reposiotory";
import { HomeownerRepository } from "../../repositories/homeowner.reposiotory";

export const getHomeOwnerById = async ({ id }) => {
  const homeownerRepository = getCustomRepository(HomeownerRepository);

  return await homeownerRepository.findOne({
    where: {
      id,
    },
  });
};

export const getHomeOwnerByPhone = async ({ phone_owner }) => {
  const homeownerRepository = getCustomRepository(HomeownerRepository);

  return await homeownerRepository.findOne({
    where: {
      phone_owner,
    },
  });
};

export const canSubmitFormHomeOwner = async (
  phone_owner: string,
  timeLimit: number = 30
): Promise<{ show: boolean; time?: string }> => {
  const homeownerRepository = getCustomRepository(HomeownerRepository);

  // Fetch the latest submission by this user based on `phone_owner`
  const latestSubmission = await homeownerRepository.findOne({
    where: {
      phone_owner,
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
