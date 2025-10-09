import { Injectable, NotFoundException } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { JwtService } from "@nestjs/jwt"
import { PassportStrategy } from "@nestjs/passport"
import { InjectRepository } from "@nestjs/typeorm"
import { ExtractJwt, Strategy } from "passport-jwt"
import { Role, User } from "src/user/entities/user.entity"
import { Repository } from "typeorm"

export type JwtPayload = {
    id:number,
    email:string,
    role:Role[]
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt'){
    constructor(
        @InjectRepository(User)
        private userRepo:Repository<User>,
        private config: ConfigService
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          secretOrKey: config.get<string>("JWT_SECRET")!
        })
    }

    async validate(payload:JwtPayload):Promise<User>{
        const user = await this.userRepo.findOneBy({ id:payload.id })

        if(!user){
            throw new NotFoundException("User Not Found")
        }

        return user
    }
}