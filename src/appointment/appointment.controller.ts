import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';
import { AppointmentResponseDto } from './dto/appointment-response.dto';

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  
  @Post('/create')
  @ApiBody({type:CreateAppointmentDto})
  @ApiResponse({ status:201, description:"Appointment created successfully" })
  @ApiResponse({ status:400, description:"Bad request" })
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentService.create(createAppointmentDto);
  }

  @Get('/All')
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

  @Get(':id')
  @ApiParam({
    name:'id',
    type:String,
    description:"Appointment ID",
    required:true
  })
  @ApiResponse({ status:200, description:"Data fetched successfully" })
  findOne(@Param('id') id: string) {
    return this.appointmentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
    return this.appointmentService.update(+id, updateAppointmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentService.remove(+id);
  }
}
