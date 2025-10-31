
# Backend Test – Nodejs, Knex, Postgress, TS

## Project Setup

To set up the project, clone the repository and install the dependencies:
```bash
git  clone https://github.com/BenjaminAlamu/paystack-solutions-be.git
cd  paystack-solutions-be
npm  install
```
## Environment Variables
This project uses environment variables to configure the database, application and other configurations. Create a `.env` file in the root directory and add the variables in the `.env.sample`:


## Scripts

The project includes a variety of npm scripts to help with development, testing, and deployment:

-  **Development:**

-  `npm run start:dev`: Starts the development server with `nodemon` for auto-reloading.

-  **Production:**

-  `npm run build`: Compiles the TypeScript code to JavaScript.

-  `npm run start`: Starts the server using the compiled JavaScript files.



-  **Database:**

-  `npm run db:migrate:make <name>`: Creates a new migration file.

-  `npm run db:migrate`: Runs all pending migrations.

-  `npm run db:migrate:rollback`: Rolls back the last set of migrations.

-  `npm run db:seed`: Runs all seed files.

  

## Module Aliases


The project uses module aliases for cleaner import statements. The following aliases are configured:

  
-  `@config`: Refers to `dist/config`.

-  `@shared`: Refers to `dist/shared`.

-  `@utils`: Refers to `dist/shared/utils`.

  

These aliases allow you to import modules using simple paths, e.g., `import config from '@config'`.

  

## Linting and Formatting

  

The project uses ESLint for code linting and Prettier for code formatting. Linting is configured to run on all JavaScript and TypeScript files. The `lint-staged` configuration ensures that only staged files are linted and formatted before committing.

  

## Database Migrations and Seeding

  

This project uses Knex.js for database migrations and seeding. The following commands are available:

  

-  `npm run db:migrate:make <name>`: Create a new migration file.

-  `npm run db:migrate`: Apply all pending migrations.

-  `npm run db:migrate:rollback`: Roll back the last migration batch.

-  `npm run db:seed`: Run all seed files.

  

Ensure you have the correct database configuration in your environment variables.

  

## Dependencies

  

This project includes a set of essential dependencies and development tools:

  

### Dependencies

  

-  `axios`: HTTP client for making requests.

-  `bcrypt`: Library for hashing passwords.

-  `cors`: Middleware for enabling CORS.

-  `express`: Web framework for building APIs.

-  `jsonwebtoken`: For generating and verifying JSON Web Tokens (JWT).

-  `knex`: SQL query builder for Node.js.

-  `objection`: ORM built on top of Knex.js.

-  `pg`: PostgreSQL client for Node.js.

- ...and many more.

  

### Dev Dependencies

  

-  `typescript`: TypeScript language support.

-  `eslint`: Linting tool for ensuring code quality.

-  `nodemon`: Utility that automatically restarts the node application when file changes are detected.

- ...and many more.