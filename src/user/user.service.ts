import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role, User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { Doctor } from 'src/doctor/entities/doctor.entity';
import { Patient } from 'src/patient/entities/patient.entity';
import { CreateDoctorDto } from 'src/doctor/dto/create-doctor.dto';
import { CreatePatientDto } from 'src/patient/dto/create-patient.dto';
import { Appointment } from 'src/appointment/entities/appointment.entity';

@Injectable()
export class UserService {
  constructor(
       @InjectRepository(User)
       private userRepo: Repository<User>,
       @InjectRepository(Doctor)
       private doctorRepo: Repository<Doctor>,
       @InjectRepository(Patient)
       private patientRepo: Repository<Patient>
  ){}

  async create(email:string,dto:CreateUserDto,role:Role):Promise<{user?:User, doctor?:Doctor, patient?:Patient}>{
      const existingUser = await this.userRepo.findOneBy({email})
      if(existingUser) throw new ConflictException("The user already exists. Login instead")
      const salt = await bcrypt.genSalt()
      const hashedPassword = await bcrypt.hash(dto.password,salt)


      
      const user = this.userRepo.create({
        ...dto,
        password:hashedPassword,
        role:role,
        isVerified:true
      })

      await this.userRepo.save(user)

      let doctor:Doctor | undefined
      let patient: Patient | undefined

      if(role === Role.DOCTOR){
        doctor = this.doctorRepo.create({user,specialization:(dto as CreateDoctorDto).specialization})
        await this.doctorRepo.save(doctor)
      }
      if(role === Role.PATIENT){
        patient = this.patientRepo.create({user,dateOfBirth:(dto as CreatePatientDto).dateOfBirth})
        await this.patientRepo.save(patient)
      }

      return {
        user: role === Role.ADMIN ? user : undefined,
        doctor,
        patient
      }
  }

  async findAll(): Promise<User[]> {
    return await this.userRepo.find({
      relations:['patient','doctor'],
      select: { 
        id:true,
        firstName:true,
        lastName:true,
        email:true
      }
    })
  }

  async remove(id: number):Promise<{message:string}> {
     const userToDelete = await this.userRepo.delete({ id })
     if(userToDelete.affected === 0 ) throw new NotFoundException("User Not Found")
     return { message:"Success !!" }
  }

  async update(id: number, updateUserDto: UpdateUserDto):Promise<{message:string,user:User}> {
    const user = await this.userRepo.preload({
      id:id,
      ...updateUserDto
    })
    if(!user) throw new NotFoundException(` User with id ${id} not found`  )
    await this.userRepo.save(user)
    return { message: " User updated successfully ", user }
  }
  
  async findOne(id:number):Promise<{user:User}>{
       const user = await this.userRepo.findOne({ 
         where: { id },
         relations: [ 'patient','doctor' ],
         select: { 
           id:true,
           firstName:true,
           lastName:true,
           email:true
          }
        })
       if(!user) throw new NotFoundException("User Not Found")
       return { user }
  }

async fetchUserAppointments(userId:number): Promise<{message:string,appointments:Appointment[] | []}> {
      const user = await this.userRepo.findOne({ 
        where: { id:userId },
      },)
      if(!user) throw new NotFoundException("User Not Found")

      if(user.role === Role.DOCTOR){
         const doctor = await this.doctorRepo.findOne({
          where: { user:{id:userId} },
          relations: [ "appointments" ],
         })
         const appointments = doctor?.appointments || []

         return { message:"Doctor appointments",appointments }
      }
      else if(user.role === Role.PATIENT){
        const patient = await this.patientRepo.findOne({
          where: { user:{ id:userId } },
          relations: [ "appointments" ]
        })
        const appointments = patient?.appointments || []

        return { message:"Patient appointments",appointments }
      } else {
         return { message:"No appointments Found",appointments:[]}
      }

  }

  async fetchDoctors():Promise<{message?:string,doctors:User[] | []}>{
    try {
      const doctors = await this.userRepo.find({
        where: { role:Role.DOCTOR },
        relations: [ 'doctor' ],
        select: {
          id:true,
          firstName:true,
          lastName:true,
          email: true
        }
      })
      return { doctors }

    } catch (error) {
      return { message:error.message, doctors: [] }
    }
  }

  async fetchPatients():Promise<{message?:string, patients:User[] | []}>{
    try {
      const patients = await this.userRepo.find({
          where: { role:Role.PATIENT },
          relations: [ 'patient' ],
          select: {
          id:true,
          firstName:true,
          lastName:true,
          email: true
        }
      })
      return { patients }
    } catch (error) {
       return { message:error.message, patients: [] }
    }
  }

}
