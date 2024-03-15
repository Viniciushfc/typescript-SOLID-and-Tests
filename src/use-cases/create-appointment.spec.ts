import { describe, expect, it, test } from "vitest";
import { CreateAppointment } from "./create-appointment";
import { Appointment } from "../entities/appointment";
import { getFutureDate } from "../../tests/utils/get-future-date";
import { InMemoryAppointmentsRepository } from "../repositories/in-memory/in-memory-appointment-repository";


describe('Create Appointment', () => {
    it('should be able to create an appointment', () => {
        const startAt = getFutureDate('2022-08-10')
        const endsAt = getFutureDate('2022-08-11')

        const appointmentsRepository = new InMemoryAppointmentsRepository()
        const createAppointment = new CreateAppointment(
            appointmentsRepository
        )

        expect(createAppointment.execute({
            customer: 'John Doe',
            startAt,
            endsAt
        })).resolves.toBeInstanceOf(Appointment)
    })
})

it('should not be able to create an appointment with overlapping dates', async () => {
    const startAt = getFutureDate('2022-08-10')
    const endsAt = getFutureDate('2022-08-15')

    const appointmentsRepository = new InMemoryAppointmentsRepository()
    const createAppointment = new CreateAppointment(
        appointmentsRepository
    )

    await createAppointment.execute({
        customer: 'John Doe',
        startAt,
        endsAt
    })

    expect(createAppointment.execute({
        customer: 'John Doe',
        startAt: getFutureDate('2022-08-14'),
        endsAt: getFutureDate('2022-08-18')
    })).rejects.toBeInstanceOf(Error)

    expect(createAppointment.execute({
        customer: 'John Doe',
        startAt: getFutureDate('2022-08-08'),
        endsAt: getFutureDate('2022-08-12')
    })).rejects.toBeInstanceOf(Error)

    expect(createAppointment.execute({
        customer: 'John Doe',
        startAt: getFutureDate('2022-08-08'),
        endsAt: getFutureDate('2022-08-17')
    })).rejects.toBeInstanceOf(Error)

    expect(createAppointment.execute({
        customer: 'John Doe',
        startAt: getFutureDate('2022-08-11'),
        endsAt: getFutureDate('2022-08-12')
    })).rejects.toBeInstanceOf(Error)
})