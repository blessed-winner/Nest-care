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

//Sign Up
async signUp( email: string, dto: CreateUserDto, role: Role,): Promise<{ message:string, verification_token?: string }>{
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(dto.password, salt);

  const existingUser = await this.userRepo.findOneBy({ email });
  if (existingUser)
    throw new BadRequestException('The user already exists. Login instead');

  const isVerified = role === Role.ADMIN;

  const user = this.userRepo.create({
    ...dto,
    password: hashedPassword,
    role,
    isVerified, // Admins are auto-verified
  });

  await this.userRepo.save(user);

  if (role === Role.DOCTOR) {
    const doctor = this.doctorRepo.create({
      user,
      specialization: (dto as CreateDoctorDto).specialization,
    });
    await this.doctorRepo.save(doctor);
  }

  if (role === Role.PATIENT) {
    const patient = this.patientRepo.create({
      user,
      dateOfBirth: (dto as CreatePatientDto).dateOfBirth,
    });
    await this.patientRepo.save(patient);
  }

  // Only unverified users get a token
  if (!isVerified) {
    const verification_token = await generateToken(
      user.id,
      user.role,
      this.configService,
      this.jwtService,
    );
    await this.mailerService.sendVerificationEmail(
      user.email,
      verification_token,
      user.firstName,
    );
    return { message:"User created successfully. Check your email for verification link", verification_token };
  }

  // Admins or already verified roles don’t need a token
  return {  message:"User created and verified successfully" };
}



//Email verification
async verifyUser(token: string): Promise<{ message: string }> {
  let payload;
  try {
    payload = await this.jwtService.verifyAsync(token);
  } catch (err) {
    throw new BadRequestException('Invalid or expired token');
  }

  const existingUser = await this.userRepo.findOneBy({ id: payload.id });
  if (!existingUser) throw new NotFoundException('User not found');

  if (existingUser.isVerified) {
    throw new BadRequestException('User already verified');
  }

  existingUser.isVerified = true;
  await this.userRepo.save(existingUser);

  return { message: 'User verified successfully' };
  
}

//Resend verification link
async resendVerification(email:string):Promise<{message:string}>{
  try {
  const user = await this.userRepo.findOneBy({ email })
  if(!user) throw new NotFoundException("User Not Found")
  if(user.isVerified) throw new BadRequestException("The user is already verified")
  const resend_token = await generateToken(user.id, user.role,this.configService,this.jwtService)
  await this.mailerService.sendVerificationEmail(email, resend_token,user.firstName)
  return { message:"Verification email sent successfully" }
  } catch (error) {
     return { message:error.message }
  }
}

  //Log in
  async signIn(dto:LoginDto): Promise<{user:User,access_token:string}> {
        const existingUser = await this.userRepo.findOneBy({ email:dto.email })
        if(!existingUser) throw new NotFoundException("User not found")
        const isPasswordValid = await bcrypt.compare(dto.password,existingUser.password)
        if(!isPasswordValid) throw new UnauthorizedException("Invalid credentials")

        const access_token = await generateToken(existingUser.id,existingUser.role,this.configService, this.jwtService)

        return { user:existingUser, access_token }
  }

}
