import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Doctor } from 'src/doctor/entities/doctor.entity';
import { Patient } from 'src/patient/entities/patient.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/utils/strategies/jwt.strategy';

@Global()
@Module({
  imports : [
    PassportModule.register({ defaultStrategy:"jwt" }),
    JwtModule.registerAsync({
         imports: [ ConfigModule ],
         inject: [ ConfigService ],
         useFactory: async (configService: ConfigService) => ({
              secret: configService.get<string>('JWT_SECRET'),
              signOptions: { expiresIn: '1m' }
         })
    }),
    TypeOrmModule.forFeature([ User, Doctor, Patient ])
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [PassportModule, JwtModule, JwtStrategy]
})
export class AuthModule {}
