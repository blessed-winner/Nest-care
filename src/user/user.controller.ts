import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, SetMetadata, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role, User } from './entities/user.entity';
import { CreateDoctorDto } from 'src/doctor/dto/create-doctor.dto';
import { CreatePatientDto } from 'src/patient/dto/create-patient.dto';
import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UserResponseDto } from './dto/user-response-dto';
import { JwtAuthGuard } from 'src/utils/guards/jwt.guard';
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { Roles, ROLES_KEY } from 'src/utils/decorator/roles.decorator';
import { Request } from 'express';


@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.ADMIN)
  @Post('/create/admin')
  @ApiBody({ type:CreateUserDto })
  @ApiResponse({ status:201, description:"User created successfully" })
  @ApiResponse({ status:400, description:"Bad request" })
  async create(@Body() dto:CreateUserDto){
    return this.userService.create(dto.email,dto,Role.ADMIN)
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.ADMIN)
  @Post('/create/doctor')
  @ApiBody({ type:CreateDoctorDto })
  @ApiResponse({ status:201, description:"User created successfully" })
  @ApiResponse({ status:400, description:"Bad request" })
  async createDoctor(@Body() dto:CreateDoctorDto){
    return this.userService.create(dto.email,dto,Role.DOCTOR)
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.ADMIN)
  @Post('/create/patient')
  @ApiBody({ type:CreatePatientDto })
  @ApiResponse({ status:201, description:"User created successfully" })
  @ApiResponse({ status:400, description:"Bad request" })
  async createPatient(@Body() dto:CreatePatientDto){
    return this.userService.create(dto.email,dto,Role.PATIENT)
  }
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.ADMIN)
  @Get('all')
  @ApiResponse({
    status: 201,
    description: " List of users ",
    type:[UserResponseDto]
  })
  @ApiResponse({ status:404, description:"Failed to fetch the list of users"})
  findAll(){
    return this.userService.findAll();
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.ADMIN)
  @Get('view/:id')
  @ApiParam({
    name:'id',
    type:String,
    required:true,
    description:"The ID of the user"
  })
   @ApiResponse({
      status:201,
      type:[UserResponseDto],
      description:"User data"
    })
  @ApiResponse({ status:400, description:"Failed to fetch user" })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('update/:id')
   @ApiParam({
    name:'id',
    type:String,
    required:true,
    description:"The ID of the user"
  })
  @ApiResponse({ status:201, description:"User updated" })
  @ApiResponse({ status:400, description:"Failed to update user" })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.ADMIN)
  @Delete('delete/:id')
   @ApiParam({
    name:'id',
    type:String,
    required:true,
    description:"The ID of the user"
  })
  @ApiResponse({ status:201, description:"User deleted" })
  @ApiResponse({ status:400, description:"Failed to delete user" })
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.ADMIN)
  @Get(':userId/appointments')
  @ApiResponse({ status:201, description:"User appointments" })
  @ApiResponse({ status:400, description:"Failed to fetch user appointments" })
  getAppointments(@Param('userId') userId:string){
     return this.userService.fetchUserAppointments(+userId)
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.ADMIN)
  @Get('doctors/all')
  @ApiResponse({status:201, description:"All Doctors"})
  @ApiResponse({status:400, description:"Problem fetching doctors"})
  getAllDoctors(){
    return this.userService.fetchDoctors()
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.ADMIN)
  @Get('patients/all')
  @ApiResponse({status:201, description:"All Patients"})
  @ApiResponse({status:400, description:"Problem fetching patients"})
  getAllPatients(){
    return this.userService.fetchPatients()
  }
}
