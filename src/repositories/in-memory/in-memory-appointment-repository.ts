import { Appointment } from "../../entities/appointment";
import { AppointmentsRepository } from "../appointments-repository"
import { areIntervalsOverlapping } from 'date-fns'

export class InMemoryAppointmentsRepository implements AppointmentsRepository {
    public items: Appointment[] = []

    async create(appointment: Appointment): Promise<void> {
        this.items.push(appointment)
    }

    async findOverLappingAppointment(startAt: Date, endsAt: Date): Promise<Appointment | null> {
        const overlappingAppointment = this.items.find(appointment => {
            return areIntervalsOverlapping(
                { start: startAt, end: endsAt},
                { start: appointment.startAt, end: appointment.endsAt},
                { inclusive: true}
            )
        })

        if(!overlappingAppointment){
            return null
        }
        return overlappingAppointment
    }
}