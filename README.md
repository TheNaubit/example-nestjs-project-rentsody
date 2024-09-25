# Example Nest.js Project

This a small example project using Nest.js, created for the Rentsody project. It consists in a basic live chat with chat history using a SQLite DB, Observables and websockets.

It has several features:
- Type-safe config
- All the gateways, services and controllers have complete Jest tests
- Using Prisma as a ORM and SQLite as a quick mockup DB
- Using observables and websockets
- Includes a Swagger URL (`/api`) and every route is fully described with examples, parameters, etc...
- Production-ready logs: Using buffered logs, with Pino, it also logs crashes and HTTP/Socket requests
- Using Nest.js DTOs and validators

## How to try?
1. Clone this repo
2. Run `cp .env.example .env`, it has the port to use as a sample config
3. Run `pnpm install` (it should also work with `npm` but I used `pnpm`). This will also generate the types from Prisma, create a SQLite DB and seed it with some messages
4. Run `pnpm run start:dev` to launch the server in Dev mode. Ready!

### What to do now?
Once it is running, you will see lots of logs but one tells you the URL were the API is listening to. By default it is listening at `http://localhost:3000`.

If you type in your browser `http://localhost:3000/api`, you will see the Swagger for the project.

If you type `http://localhost:3000/ping`, you will see a basic pong endpoint.

If you type `http://localhost:3000`, a static page will load with a live chat. Enter any username and you will see all the seeded messages and any other message you send in realtime. Feel free to try in different windows at the same time.

### What about the tests?
If you run `pnpm run test` the tests will run and (hopefully) nothing will fail.

### Notes
If you change the `PORT` var in the `.env`, you will also need to modify the port where the API is in the `/client/index.html` file, so the static page knows where to connect to the API.