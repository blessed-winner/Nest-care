import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from './entities/user.entity';
import { CreateDoctorDto } from 'src/doctor/dto/create-doctor.dto';
import { CreatePatientDto } from 'src/patient/dto/create-patient.dto';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { UserResponseDto } from './dto/user-response-dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create/admin')
  @ApiBody({ type:CreateUserDto })
  @ApiResponse({ status:201, description:"User created successfully" })
  @ApiResponse({ status:400, description:"Bad request" })
  async create(@Body() dto:CreateUserDto){
    return this.userService.create(dto.email,dto,Role.ADMIN)
  }

  @Post('/create/doctor')
  @ApiBody({ type:CreateDoctorDto })
  @ApiResponse({ status:201, description:"User created successfully" })
  @ApiResponse({ status:400, description:"Bad request" })
  async createDoctor(@Body() dto:CreateDoctorDto){
    return this.userService.create(dto.email,dto,Role.DOCTOR)
  }

  @Post('/create/patient')
  @ApiBody({ type:CreatePatientDto })
  @ApiResponse({ status:201, description:"User created successfully" })
  @ApiResponse({ status:400, description:"Bad request" })
  async createPatient(@Body() dto:CreatePatientDto){
    return this.userService.create(dto.email,dto,Role.PATIENT)
  }

  @Get('All')
  @ApiResponse({
    status: 201,
    description: " List of users ",
    type:[UserResponseDto]
  })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
