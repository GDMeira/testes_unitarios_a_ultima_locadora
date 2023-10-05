import { faker } from '@faker-js/faker';

export function createRandomMovie(rentalId: number | null = null, adultsOnly: boolean = faker.datatype.boolean()) {
    return {
        id: Math.floor(Math.random() * 1000),
        name: faker.lorem.words(3),
        adultsOnly,
        rentalId
    }
}
