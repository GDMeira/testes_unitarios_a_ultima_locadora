import { faker } from '@faker-js/faker';

export function createRandomRental(userId: number = Math.floor(Math.random() * 1000)) {
    const closed = faker.datatype.boolean();

    return {
        id: Math.floor(Math.random() * 1000),
        userId,
        closed,
        date: faker.date.recent(),
        endDate: (closed ? new Date() : null),
    }
}