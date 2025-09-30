import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PatientModule } from './patient/patient.module';
import { DoctorModule } from './doctor/doctor.module';
import { AppointmentModule } from './appointment/appointment.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { Patient } from './patient/entities/patient.entity';
import { Doctor } from './doctor/entities/doctor.entity';
import { Appointment } from './appointment/entities/appointment.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
       type:'postgres',
       host:'localhost',
       port: 5432,
       username: 'postgres',
       password: 'HomesweetHome',
       database: 'nest_care_db',
       entities: [ User, Patient, Doctor, Appointment ],
       synchronize:true
    }),
    AuthModule, PatientModule, DoctorModule, AppointmentModule, UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
