import { Injectable } from '@nestjs/common';
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
  async create(dto: CreateAppointmentDto) {
        const appointment = this.appointmentRepo.create({
          ...dto
        })
        await this.appointmentRepo.save(appointment)
        return { appointment }

  }

  findAll() {
    return `This action returns all appointment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} appointment`;
  }

  update(id: number, dto: UpdateAppointmentDto) {
    return `This action updates a #${id} appointment`;
  }

  remove(id: number) {
    return `This action removes a #${id} appointment`;
  }
}
