import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { Role, User } from 'src/user/entities/user.entity';
import { Doctor } from 'src/doctor/entities/doctor.entity';
import { Patient } from 'src/patient/entities/patient.entity';

@Injectable()

export class AppointmentService {
constructor(
  @InjectRepository(Appointment) 
  private appointmentRepo: Repository<Appointment>,
  @InjectRepository(User)
  private userRepo: Repository<User>
){}
  async create(dto: CreateAppointmentDto):Promise<{message:string,appointment:Appointment}> {
        const appointment = this.appointmentRepo.create({
          ...dto
        })
        await this.appointmentRepo.save({
          doctor:{ id:dto.doctorId },
          patient:{ id:dto.patientId },
          appointmentDate:dto.appointmentDate,
          status:dto.status,
          reason:dto.reason
        })
        return { message:"Success!!", appointment }

  }

  async findAll():Promise<Appointment[]> {
       const appointments = await this.appointmentRepo.find({
        relations:[ 'doctor','patient' ]
       })
       return appointments
  }

  async findOne(id: number):Promise<{appointment:Appointment}> {
      const appointment = await this.appointmentRepo.findOne({
        where: { id },
        relations: [ 'doctor','patient' ]
      })
      if(!appointment) throw new NotFoundException("Appointment Not Found")

      return {appointment}
  }

  async update(id: number, dto: UpdateAppointmentDto):Promise<{message:string,appointmentToUpdate:Appointment}> {
     const appointmentToUpdate = await this.appointmentRepo.preload({
        id:id,
        ...dto
     })
     if(!appointmentToUpdate) throw new NotFoundException("Appointment Not Found")
     await this.appointmentRepo.save(appointmentToUpdate)

     return { message:"Success!!!" , appointmentToUpdate }
  }

  async remove(id: number):Promise<{message:string}> {
     const appToDelete = await this.appointmentRepo.delete({ id })
     if(appToDelete.affected === 0 ) throw new NotFoundException(`Appointment with id ${id} Not Found`)
      return { message:"Success!!!" }
  }
}
