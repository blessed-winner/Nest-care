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

  @Post('admin/register')
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status:201, description:"Admin created successfully" })
  @ApiResponse({ status:400, description:"Bad Request" })
  async signUp(@Body() dto: CreateUserDto) {
    return await this.authService.signUp(dto.email,dto,Role.ADMIN);
  }
  @Post('doctor/register')
  @ApiBody({ type: CreateDoctorDto })
  @ApiResponse({ status:201, description:"Doctor created successfully" })
  @ApiResponse({ status:400, description:"Bad Request" })
  async doctorSignUp(@Body() dto: CreateDoctorDto){
    return await this.authService.signUp(dto.email,dto,Role.DOCTOR)
  }
  @Post('patient/register')
  @ApiBody({ type: CreatePatientDto })
  @ApiResponse({ status:201, description:"Patient created successfully" })
  @ApiResponse({ status:400, description:"Bad Request" })
  async patientSignUp(@Body() dto: CreatePatientDto){
    return await this.authService.signUp(dto.email,dto,Role.PATIENT)
  }

  @Get('/verify-user')
  @ApiResponse({ status:201, description:"User verified successfully" })
  @ApiResponse({ status:400, description:"Bad Request" })
  async verifyEmail(@Query('token') token:string, @Res() res:Response){
    try{
        await this.authService.verifyUser(token)
        return res.render('success')
    }
    catch(error){
      return res.render('failure')
    }
    
  }

  @Post('resend-verification')
  @ApiResponse({ status:201, description:"User verified successfully" })
  @ApiResponse({ status:400, description:"Bad Request" })
  async resendVerificationEmail(@Body('email') email:string){
    await this.authService.resendVerification(email)
  }

  @Post('login')
  @ApiBody({ type:LoginDto })
  @ApiResponse({ status:201, description:"User logged in successfully" })
  @ApiResponse({ status:400, description:"Bad Request" })
  async logIn(@Body() dto:LoginDto){
    const result = await this.authService.signIn(dto)
    return result;
  }
}
