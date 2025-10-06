import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from './entities/user.entity';
import { CreateDoctorDto } from 'src/doctor/dto/create-doctor.dto';
import { CreatePatientDto } from 'src/patient/dto/create-patient.dto';
import { ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';
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
  @ApiResponse({ status:404, description:"Failed to fetch the list of users"})
  findAll(){
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiParam({
    name:'id',
    type:String,
    required:true,
    description:"The ID of the user"
  })
  @ApiResponse({ status:201, description:"Appointment loaded" })
  @ApiResponse({ status:400, description:"Failed to fetch appointment" })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
   @ApiParam({
    name:'id',
    type:String,
    required:true,
    description:"The ID of the user"
  })
  @ApiResponse({ status:201, description:"Appointment updated" })
  @ApiResponse({ status:400, description:"Failed to update appointment" })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
   @ApiParam({
    name:'id',
    type:String,
    required:true,
    description:"The ID of the user"
  })
  @ApiResponse({ status:201, description:"Appointment deleted" })
  @ApiResponse({ status:400, description:"Failed to delete appointment" })
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
