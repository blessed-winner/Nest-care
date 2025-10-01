import { ConfigService } from "@nestjs/config"
import { JwtService } from "@nestjs/jwt"
import { Role } from "src/user/entities/user.entity"


export const generateToken = async(id:number, role:Role) => {
     const payload = { id, role }
     const config = new ConfigService()
     const jwt = new JwtService()

     const token = await jwt.signAsync(payload,{
        secret:config.get('JWT_SECRET'),
        expiresIn:'1m'
     })

     return token
}