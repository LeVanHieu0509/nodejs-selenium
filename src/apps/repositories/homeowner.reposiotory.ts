import { EntityRepository, Repository } from "typeorm";
import { HomeOwner } from "../modules/entities/homeowner.entity";

@EntityRepository(HomeOwner)
export class HomeownerRepository extends Repository<HomeOwner> {}
