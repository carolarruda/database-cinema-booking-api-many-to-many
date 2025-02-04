const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seed() {
  await createCustomer();
  const movies = await createMovies();
  const screens = await createScreens();
  const seats = await createSeats();
  await createScreenings(screens, movies, seats);

  process.exit(0);
}

async function createCustomer() {
  const customer = await prisma.customer.create({
    data: {
      name: "Alice",
      contact: {
        create: {
          email: "alice@boolean.co.uk",
          phone: "1234567890",
        },
      },
    },
    include: {
      contact: true,
    },
  });

  console.log("Customer created", customer);

  return customer;
}

async function createMovies() {
  const rawMovies = [
    { title: "The Matrix", runtimeMins: 120 },
    { title: "Dodgeball", runtimeMins: 154 },
  ];

  const movies = [];

  for (const rawMovie of rawMovies) {
    const movie = await prisma.movie.create({ data: rawMovie });
    movies.push(movie);
  }

  console.log("Movies created", movies);

  return movies;
}

async function createScreens() {
  const rawScreens = [{ number: 8 }, { number: 9 }];

  const screens = [];

  for (const rawScreen of rawScreens) {
    const screen = await prisma.screen.create({
      data: rawScreen,
    });

    console.log("Screen created", screen);

    screens.push(screen);
  }

  return screens;
}

async function createSeats() {
  const rawSeats = [];
  const letters = ["A", "B", "C", "D"];

  for (let i = 0; i < 4; i++) {
    for (let j = 1; j <= 6; j++) {
      rawSeats.push({ aisle: letters[i], number: j });
    }
  }

  const seats = [];

  for (const rawSeat of rawSeats) {
    const seat = await prisma.seat.create({ data: rawSeat });
    seats.push(seat);
  }

  console.log("seat created", seats);

  return seats;
}

async function createScreenings(screens, movies, seats) {
    const screeningDate = new Date();
  
    for (const screen of screens) {
      for (let i = 0; i < movies.length; i++) {
        screeningDate.setDate(screeningDate.getDate() + i);
  
        const screening = await prisma.screening.create({
          data: {
            startsAt: screeningDate,
            movie: {
              connect: {
                id: movies[i].id,
              },
            },
            screen: {
              connect: {
                id: screen.id,
              },
            },
            seats: {
              connect: seats.map((seat) => ({ id: seat.id })),
            },
          }
        });
  
        console.log("Screening created", screening);
      }
    }
  }

  async function createTickets(){
    
  }
  

seed()
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  })
  .finally(() => process.exit(1));
