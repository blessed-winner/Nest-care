import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment, AppStatus } from './entities/appointment.entity';
import { Role, User } from 'src/user/entities/user.entity';
import { Doctor } from 'src/doctor/entities/doctor.entity';
import { Patient } from 'src/patient/entities/patient.entity';

@Injectable()

export class AppointmentService {
constructor(
  @InjectRepository(Appointment) 
  private appointmentRepo: Repository<Appointment>,
  @InjectRepository(User)
  private userRepo: Repository<User>,
  @InjectRepository(Doctor)
  private doctorRepo: Repository<Doctor>,
  @InjectRepository(Patient)
  private patientRepo: Repository<Patient>
){}
  async create(
  dto: CreateAppointmentDto,
  userId: number
): Promise<{ message: string; appointment: Appointment }> {
  try {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new NotFoundException("User not found");

    let doctorId = dto.doctorId;
    let patientId = dto.patientId;
    let status = AppStatus.PENDING; // Default status

    // Role-based logic
    if (user.role === Role.DOCTOR) {
       const doctor = await this.doctorRepo.findOne({
        where: { user:{ id: userId } }
       })
      doctorId = doctor?.id;
      status = AppStatus.APPROVED; // Doctors can auto approve
    } else if (user.role === Role.PATIENT) {
      const patient  = await this.patientRepo.findOne({
        where: { user:{ id:userId } }
      })
      patientId = patient?.id
      status = AppStatus.PENDING; // Patients wait for approval
    } else if (user.role === Role.ADMIN) {
      
      status = AppStatus.APPROVED;
    }

    const appointment = this.appointmentRepo.create({
      doctor: { id: doctorId },
      patient: { id: patientId },
      appointmentDate: dto.appointmentDate,
      reason: dto.reason,
      status,
    });

    const savedAppointment = await this.appointmentRepo.save(appointment);

    return { message: "Appointment created successfully", appointment: savedAppointment };
  } catch (error) {
    console.error(error);
    throw new BadRequestException("Error in creating the appointment");
  }
}

async findMyAppointments(userId:number){
  try {
   const user = await this.userRepo.findOneBy({ id:userId })
    if(user?.role ===  Role.DOCTOR){
      const appointments = await this.appointmentRepo.find({
        where: { doctor: { user: { id:userId } } },
        select:{
          id:true,
          patient:{
             id:true,
             user:{
               firstName:true,
               lastName:true
             }
          },
          appointmentDate:true,
          reason:true
        }
      })

      return { message:"Your appointments", appointments }
    }

    if(user?.role === Role.PATIENT){
        const appointments = await this.appointmentRepo.find({
        where: { patient: { user: { id:userId } } },
        select:{
          id:true,
          doctor:{
             id:true,
             user:{
               firstName:true,
               lastName:true
             }
          },
          appointmentDate:true,
          reason:true
        }
      })

      return{ message:"Your appointments", appointments }
    }
  } catch (error) {
      console.log( error )
      throw new BadRequestException("Failed to fetch your appointments")
  }

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
