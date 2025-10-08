import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AppointmentModule } from './appointment/appointment.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { Patient } from './patient/entities/patient.entity';
import { Doctor } from './doctor/entities/doctor.entity';
import { Appointment } from './appointment/entities/appointment.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
       isGlobal:true,
       envFilePath: '.env'
    }),
    TypeOrmModule.forRootAsync({
       imports : [ ConfigModule ],
       inject: [ConfigService],
      useFactory:(configService:ConfigService) => ({
       type:'postgres',
       host:configService.get<string>('DB_HOST'),
       port:configService.get<number>('DB_PORT'),
       username:configService.get<string>('DB_USERNAME'),
       password:configService.get<string>('DB_PASS'),
       database:configService.get<string>('DB_NAME'),
       entities: [ User, Patient, Doctor, Appointment ],
       synchronize:true
      })
     }),
    AuthModule, AppointmentModule, UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
