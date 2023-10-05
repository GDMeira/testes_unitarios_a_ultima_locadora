import rentalsRepository from "repositories/rentals-repository";
import rentalsService from "../../src/services/rentals-service";
import { createRandomMovie, createRandomRental, createRandomUser } from "../factories";
import usersRepository from "repositories/users-repository";
import moviesRepository from "repositories/movies-repository";

describe("Rentals Service Unit Tests", () => {
  describe("getRentals", () => {
    it("should return all rentals", async () => {
      jest.spyOn(rentalsRepository, "getRentals").mockResolvedValueOnce([
        createRandomRental(),
        createRandomRental(),
      ])

      const rentals = await rentalsService.getRentals();
      expect(rentals.length).toBe(2);
    })
  })

  describe("getRentalsById", () => {
    it("should return the rental with movies", async () => {
      const rental = createRandomRental();
      const movie1 = createRandomMovie(rental.id);
      const movie2 = createRandomMovie(rental.id);
      jest.spyOn(rentalsRepository, "getRentalById").mockResolvedValueOnce({
        ...rental,
        movies: [movie1, movie2]
      })

      const response = await rentalsService.getRentalById(rental.id);
      expect(response).toEqual({ ...rental, movies: [movie1, movie2] });
    })

    it("should return not found error", async () => {
      jest.spyOn(rentalsRepository, "getRentalById").mockResolvedValueOnce(undefined)

      const response = rentalsService.getRentalById(1);
      expect(response).rejects.toEqual({
        name: "NotFoundError",
        message: "Rental not found."
      });
    })
  })

  describe("createRental", () => {
    it("should create the rental with movies", async () => {
      const user = createRandomUser();
      const movie1 = createRandomMovie();
      const movie2 = createRandomMovie();
      const movies = [movie1, movie2];
      jest.spyOn(usersRepository, "getById").mockResolvedValueOnce(user);
      jest.spyOn(rentalsRepository, "getRentalsByUserId").mockResolvedValueOnce([]);
      jest.spyOn(moviesRepository, "getById").mockImplementation((id): any => movies.find(movie => movie.id === id));
      jest.spyOn(rentalsRepository, "createRental").mockResolvedValueOnce(undefined);

      const response = await rentalsService.createRental({ userId: user.id, moviesId: [movie1.id, movie2.id] });
      expect(response).toEqual(undefined);
    })

    it("should return pendent rental error", async () => {
      const user = createRandomUser();
      const rental = createRandomRental(user.id);
      const movie1 = createRandomMovie();
      const movie2 = createRandomMovie();
      const movies = [movie1, movie2];
      jest.spyOn(usersRepository, "getById").mockResolvedValueOnce(user);
      jest.spyOn(rentalsRepository, "getRentalsByUserId").mockResolvedValueOnce([rental]);
      jest.spyOn(moviesRepository, "getById").mockImplementation((id): any => movies.find(movie => movie.id === id));
      jest.spyOn(rentalsRepository, "createRental").mockResolvedValueOnce(undefined);

      const response = rentalsService.createRental({ userId: user.id, moviesId: [movie1.id, movie2.id] });
      expect(response).rejects.toEqual({
        name: "PendentRentalError",
        message: "The user already have a rental!"
      });
    })

    it("should return not found error", async () => {
      const user = createRandomUser();
      const movie1 = createRandomMovie();
      const movie2 = createRandomMovie();
      const movies = [movie1, movie2];
      jest.spyOn(usersRepository, "getById").mockResolvedValueOnce(user);
      jest.spyOn(rentalsRepository, "getRentalsByUserId").mockResolvedValueOnce([]);
      jest.spyOn(moviesRepository, "getById").mockImplementation((id): any => movies.find(movie => movie.id === id));
      jest.spyOn(rentalsRepository, "createRental").mockResolvedValueOnce(undefined);

      const response = rentalsService.createRental({ userId: user.id, moviesId: [movie1.id + 1, movie2.id] });
      expect(response).rejects.toEqual({
        name: "NotFoundError",
        message: "Movie not found."
      });
    })

    it("should return movie is already in rental error", async () => {
      const user = createRandomUser();
      const movie1 = createRandomMovie(1);
      const movie2 = createRandomMovie();
      const movies = [movie1, movie2];
      jest.spyOn(usersRepository, "getById").mockResolvedValueOnce(user);
      jest.spyOn(rentalsRepository, "getRentalsByUserId").mockResolvedValueOnce([]);
      jest.spyOn(moviesRepository, "getById").mockImplementation((id): any => movies.find(movie => movie.id === id));
      jest.spyOn(rentalsRepository, "createRental").mockResolvedValueOnce(undefined);

      const response = rentalsService.createRental({ userId: user.id, moviesId: [movie1.id, movie2.id] });
      expect(response).rejects.toEqual({
        name: "MovieInRentalError",
        message: "Movie already in a rental."
      });
    })

    it("should return insufficient age error", async () => {
      const user = createRandomUser(2020);
      const movie1 = createRandomMovie(null, true);
      const movie2 = createRandomMovie();
      const movies = [movie1, movie2];
      jest.spyOn(usersRepository, "getById").mockResolvedValueOnce(user);
      jest.spyOn(rentalsRepository, "getRentalsByUserId").mockResolvedValueOnce([]);
      jest.spyOn(moviesRepository, "getById").mockImplementation((id): any => movies.find(movie => movie.id === id));
      jest.spyOn(rentalsRepository, "createRental").mockResolvedValueOnce(undefined);

      const response = rentalsService.createRental({ userId: user.id, moviesId: [movie1.id, movie2.id] });
      expect(response).rejects.toEqual({
        name: "InsufficientAgeError",
        message: "Cannot see that movie."
      });
    })
  })

  describe("createRental", () => {
    it("should finish the rental", async () => {
      const user = createRandomUser();
      const rental = createRandomRental(user.id);
      const movie1 = createRandomMovie(rental.id);
      const movie2 = createRandomMovie(rental.id);
      jest.spyOn(rentalsRepository, "getRentalById").mockResolvedValueOnce({
        ...rental,
        movies: [movie1, movie2]
      });
      jest.spyOn(rentalsRepository, "finishRental").mockResolvedValueOnce(undefined);

      const response = await rentalsService.finishRental(rental.id);
      expect(response).toEqual(undefined);
    })

    it("should return not found error", async () => {
      const user = createRandomUser();
      const rental = createRandomRental(user.id);
      const movie1 = createRandomMovie(rental.id);
      const movie2 = createRandomMovie(rental.id);
      jest.spyOn(rentalsRepository, "getRentalById").mockResolvedValueOnce(undefined);
      jest.spyOn(rentalsRepository, "finishRental").mockResolvedValueOnce(undefined);

      const response = rentalsService.finishRental(rental.id);
      expect(response).rejects.toEqual({
        name: "NotFoundError",
        message: "Rental not found."
      });
    })
  })
})