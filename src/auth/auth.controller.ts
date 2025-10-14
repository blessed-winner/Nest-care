import { Controller, Post, Body, Patch, Query, Get, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Role } from 'src/user/entities/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { CreateDoctorDto } from 'src/doctor/dto/create-doctor.dto';
import { CreatePatientDto } from 'src/patient/dto/create-patient.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from 'src/user/dto/log-in-dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  //Register admin
  @Post('admin/register')
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status:201, description:"Admin created successfully" })
  @ApiResponse({ status:400, description:"Bad Request" })
  async signUp(@Body() dto: CreateUserDto) {
    return await this.authService.signUp(dto.email,dto,Role.ADMIN);
  }

  //Register doctor
  @Post('doctor/register')
  @ApiBody({ type: CreateDoctorDto })
  @ApiResponse({ status:201, description:"Doctor created successfully" })
  @ApiResponse({ status:400, description:"Bad Request" })
  async doctorSignUp(@Body() dto: CreateDoctorDto){
    return await this.authService.signUp(dto.email,dto,Role.DOCTOR)
  }

  //Register patient
  @Post('patient/register')
  @ApiBody({ type: CreatePatientDto })
  @ApiResponse({ status:201, description:"Patient created successfully" })
  @ApiResponse({ status:400, description:"Bad Request" })
  async patientSignUp(@Body() dto: CreatePatientDto){
    return await this.authService.signUp(dto.email,dto,Role.PATIENT)
  }

  //Verify the user
  @Get('/verify-user')
  @ApiResponse({ status:201, description:"User verified successfully" })
  @ApiResponse({ status:400, description:"Bad Request" })
  @ApiResponse({ status:404,  description:"User not Found" })
  async verifyEmail(@Query('token') token:string, @Res() res:Response){
    try{
        await this.authService.verifyUser(token)
        return res.render('success')
    }
    catch(error){
      return res.render('failure')
    }
    
  }

  //Resend verification link
  @Post('resend-verification')
  @ApiResponse({ status: 200, description: "Verification email resent successfully" })
  @ApiResponse({ status: 400, description: "Bad Request" })
  @ApiResponse({ status: 404, description: "User not found" })
  async resendVerificationEmail(@Body('email') email:string){
    const result = await this.authService.resendVerification(email)
    return result
  }

  //Sign in
  @Post('login')
  @ApiBody({ type:LoginDto })
  @ApiResponse({ status:201, description:"User logged in successfully" })
  @ApiResponse({ status:400, description:"Bad Request" })
  @ApiResponse({ status:404,  description:"User not Found" })
  async logIn(@Body() dto:LoginDto){
    const result = await this.authService.signIn(dto)
    return result;
  }
}
