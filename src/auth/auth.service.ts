import { BadRequestException,Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
import { generateToken } from 'src/utils/jwtutil';
import { LoginDto } from 'src/user/dto/log-in-dto';

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

  async signUp(email:string, dto: CreateUserDto,role:Role): Promise<{user?:User,patient?:Patient,doctor?:Doctor,access_token:string}> {
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(dto.password,salt)

        const existingUser = await this.userRepo.findOneBy({email})
        if(existingUser) throw new BadRequestException("The user already exists. Login instead")

        const user = this.userRepo.create({
          ...dto,
          password:hashedPassword,
          role:role,
        })


        await this.userRepo.save(user)

        let doctor : Doctor | undefined
        let patient:Patient | undefined

        if( role === Role.DOCTOR ){
          doctor = this.doctorRepo.create({user, specialization:(dto as CreateDoctorDto).specialization})
          await this.doctorRepo.save(doctor)
        }

        if(role === Role.PATIENT ){
          patient = this.patientRepo.create({user,dateOfBirth:(dto as CreatePatientDto).dateOfBirth})
          await this.patientRepo.save(patient)
        }

        const token = await generateToken(user.id,user.role)

        return{user: role === Role.ADMIN ? user : undefined,
           doctor,
           patient,
          access_token:token
        }
}
  
  async signIn(dto:LoginDto): Promise<{user:User,access_token:string}> {
        const existingUser = await this.userRepo.findOneBy({ email:dto.email })
        if(!existingUser) throw new NotFoundException("User not found")
        const isPasswordValid = await bcrypt.compare(dto.password,existingUser.password)
        if(!isPasswordValid) throw new UnauthorizedException("Invalid credentials")

        const access_token = await generateToken(existingUser.id,existingUser.role)

        return { user:existingUser, access_token }
  }

}
