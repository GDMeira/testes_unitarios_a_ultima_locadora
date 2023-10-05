import { faker } from "@faker-js/faker";


export function createRandomUser(yearOfBirth: number = 2000) {
    return {
        id: faker.number.int({ min: 1, max: 1000 }),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        birthDate: faker.date.past({refDate: new Date(`${yearOfBirth}-01-01`)}),
        cpf: faker.helpers.replaceSymbolWithNumber("###.###.###-##"),
    }
}