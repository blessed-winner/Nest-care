import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Role, User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Doctor } from 'src/doctor/entities/doctor.entity';
import { Patient } from 'src/patient/entities/patient.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import * as bcrypt from 'bcrypt'
import { CreateDoctorDto } from 'src/doctor/dto/create-doctor.dto';
import { CreatePatientDto } from 'src/patient/dto/create-patient.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
 constructor(
     @InjectRepository(User)
     private userRepo: Repository<User>,
    @InjectRepository(Doctor)
    private doctorRepo: Repository<Doctor>,
    @InjectRepository(Patient)
    private patientRepo: Repository<Patient>,
    private jwtService: JwtService
  ){}

  async signUp(dto: CreateUserDto,role:Role): Promise<{access_token:string}> {
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(dto.password,salt)

        const user = this.userRepo.create({
          ...dto,
          password:hashedPassword,
          role:role,
        })

        await this.userRepo.save(user)

        if( role === Role.DOCTOR ){
          const doctor = this.doctorRepo.create({user, specialization:(dto as CreateDoctorDto).specialization})
          await this.doctorRepo.save(doctor)
        }

        if(role === Role.PATIENT ){
          const patient = this.patientRepo.create({user,dateOfBirth:(dto as CreatePatientDto).dateOfBirth})
          await this.patientRepo.save(patient)
        }

        const payload = { id:user.id, role: user.role }
        const access_token = await this.jwtService.signAsync(payload)

        return { access_token }

  }
  
  async signIn(email:string,password:string): Promise<{access_token:string}> {
        const existingUser = await this.userRepo.findOneBy({ email })
        if(!existingUser) throw new NotFoundException("User not found")
        const isPasswordValid = await bcrypt.compare(password,existingUser.password)
        if(!isPasswordValid) throw new UnauthorizedException("Invalid credentials")

        const payload = {
          id:existingUser.id,
          role:existingUser.role
        }
        const access_token = await this.jwtService.signAsync(payload)

        return { access_token }
  }

}
