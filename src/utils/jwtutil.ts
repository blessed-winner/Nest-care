import { ConfigService } from "@nestjs/config"
import { JwtService } from "@nestjs/jwt"
import { Role } from "src/user/entities/user.entity"


export const generateToken = async(id:number, role:Role, config:ConfigService, jwt:JwtService) => {
     const payload = { id, role }

     const token = await jwt.signAsync(payload,{
        secret:config.get('JWT_SECRET'),
        expiresIn:'1h'
     })

     return token
}