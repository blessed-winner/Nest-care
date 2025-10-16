import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';
import { AppointmentResponseDto } from './dto/appointment-response.dto';
import { JwtAuthGuard } from 'src/utils/guards/jwt.guard';
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { Roles } from 'src/utils/decorator/roles.decorator';
import { Role, User } from 'src/user/entities/user.entity';
import { Request } from 'express';


@Controller('appointment')
export class AppointmentController {
  constructor(
    private readonly appointmentService: AppointmentService,
  ) {}

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Post('/create')
  @ApiBody({type:CreateAppointmentDto})
  @ApiResponse({ status:201, description:"Appointment created successfully" })
  @ApiResponse({ status:400, description:"Bad request" })
  create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @Req()  req:Request
  ){
    try{
      const user = req.user as { id:number, role:Role }
      const userId = user.id
      return this.appointmentService.create(createAppointmentDto,+userId);
    }
    catch(error){
      console.log( error )
      throw new BadRequestException("Error creating appointment")
    }
    
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.ADMIN)
  @Get('/all')
  @ApiResponse({
    status:201,
    type:[AppointmentResponseDto],
    description:"List of appointments"
  })
  @ApiResponse({
    status:404,
    description:"List of appointments not found"
  })
  findAll() {
    return this.appointmentService.findAll();
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.ADMIN)
  @Get(':id')
  @ApiParam({
    name:'id',
    type:String,
    description:"Appointment ID",
    required:true
  })
  @ApiResponse({
    status:201,
    type:[AppointmentResponseDto],
    description:"Appointment data"
  })
  @ApiResponse({ status:400, description:"Failed to fetch appointment data" })
  findOne(@Param('id') id: string) {
    return this.appointmentService.findOne(+id);
  }
  
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  @ApiParam({
    name:'id',
    type:String,
    description:"Appointment ID",
    required:true
  })
  @ApiResponse({ status:201, description:"Data updated successfully" })
  @ApiResponse({ status:400, description:"Failed to update appointment data" })
  update(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
    return this.appointmentService.update(+id, updateAppointmentDto);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
    @ApiParam({
    name:'id',
    type:String,
    description:"Appointment ID",
    required:true
  })
  @ApiResponse({ status:201, description:"Data deleted successfully" })
  @ApiResponse({ status:400, description:"Failed to delete appointment data" })
  remove(@Param('id') id: string) {
    return this.appointmentService.remove(+id);
  }
}
