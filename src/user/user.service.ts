import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role, User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { Doctor } from 'src/doctor/entities/doctor.entity';
import { Patient } from 'src/patient/entities/patient.entity';
import { CreateDoctorDto } from 'src/doctor/dto/create-doctor.dto';
import { CreatePatientDto } from 'src/patient/dto/create-patient.dto';

@Injectable()
export class UserService {
  constructor(
       @InjectRepository(User)
       private userRepo: Repository<User>,
       @InjectRepository(Doctor)
       private doctorRepo: Repository<Doctor>,
       @InjectRepository(Patient)
       private patientRepo: Repository<Patient>
  ){}

  async create(dto:CreateUserDto,role:Role):Promise<{user?:User, doctor?:Doctor, patient?:Patient}>{
      const salt = await bcrypt.genSalt()
      const hashedPassword = await bcrypt.hash(dto.password,salt)

      
      const user = this.userRepo.create({
        ...dto,
        password:hashedPassword,
        role:role
      })

      await this.userRepo.save(user)

      let doctor:Doctor | undefined
      let patient: Patient | undefined

      if(role === Role.DOCTOR){
        doctor = this.doctorRepo.create({user,specialization:(dto as CreateDoctorDto).specialization})
        await this.doctorRepo.save(doctor)
      }
      if(role === Role.PATIENT){
        patient = this.patientRepo.create({user,dateOfBirth:(dto as CreatePatientDto).dateOfBirth})
        await this.patientRepo.save(patient)
      }

      return {
        user: role === Role.ADMIN ? user : undefined,
        doctor,
        patient
      }
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
