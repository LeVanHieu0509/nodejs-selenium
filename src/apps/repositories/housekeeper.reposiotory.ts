import { EntityRepository, Repository } from "typeorm";
import { HouseKeeper } from "../modules/entities/housekeeper.entity";

@EntityRepository(HouseKeeper)
export class HouseKeeperRepository extends Repository<HouseKeeper> {}
