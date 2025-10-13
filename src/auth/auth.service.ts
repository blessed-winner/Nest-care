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
import { ConfigService } from '@nestjs/config';
import { MailerService } from './mailer/mailer.service';

@Injectable()
export class AuthService {
 constructor(
     @InjectRepository(User)
     private userRepo: Repository<User>,
    @InjectRepository(Doctor)
    private doctorRepo: Repository<Doctor>,
    @InjectRepository(Patient)
    private patientRepo: Repository<Patient>,
    private jwtService: JwtService,
    private configService:ConfigService,
    private mailerService:MailerService
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

        const token = await generateToken(user.id,user.role,this.configService,this.jwtService)

        await this.mailerService.sendVerificationEmail(user.email,token)

        return{user: role === Role.ADMIN ? user : undefined,
           doctor,
           patient,
          access_token:token
        }
}


async verifyUser(token:string):Promise<{message:string}>{
    const payload = await this.jwtService.verifyAsync(token)
    const existingUser = await this.userRepo.findOneBy({ email:payload.email })
    if(!existingUser) throw new NotFoundException("User Not Found")
    
    if(existingUser && existingUser.isVerified === true ){
        throw new BadRequestException("User already verified")
    }

    existingUser.isVerified = true

    await this.userRepo.save(existingUser)

    return { message:"User verified successfully" }
}
  
  async signIn(dto:LoginDto): Promise<{user:User,access_token:string}> {
        const existingUser = await this.userRepo.findOneBy({ email:dto.email })
        if(!existingUser) throw new NotFoundException("User not found")
        const isPasswordValid = await bcrypt.compare(dto.password,existingUser.password)
        if(!isPasswordValid) throw new UnauthorizedException("Invalid credentials")

        const access_token = await generateToken(existingUser.id,existingUser.role,this.configService, this.jwtService)

        return { user:existingUser, access_token }
  }

}
