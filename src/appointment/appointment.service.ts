import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';

@Injectable()

export class AppointmentService {
constructor(
  @InjectRepository(Appointment) 
  private appointmentRepo: Repository<Appointment>
){}
  async create(dto: CreateAppointmentDto):Promise<{message:string,appointment:Appointment}> {
        const appointment = this.appointmentRepo.create({
          ...dto
        })
        await this.appointmentRepo.save(appointment)
        return { message:"Success!!", appointment }

  }

  async findAll():Promise<Appointment[]> {
       const appointments = await this.appointmentRepo.find({
        relations:[ 'user' ]
       })
       return appointments
  }

  async findOne(id: number):Promise<{appointment:Appointment}> {
      const appointment = await this.appointmentRepo.findOne({
        where: { id },
        relations: [ 'user' ]
      })
      if(!appointment) throw new NotFoundException("Appointment Not Found")

      return {appointment}
  }

  update(id: number, dto: UpdateAppointmentDto) {
    return `This action updates a #${id} appointment`;
  }

  remove(id: number) {
    return `This action removes a #${id} appointment`;
  }
}
