# SETUP
- Clone this repository

- Install project dependencies. npm or yarn

    ```sh
        yarn install
    ```

    ```sh
        npm install
    ```

- Copy .env.sample variables and fill the appropriate values
    ```sh
        cp -r .env.sample .env
    ```

- Run the server in watch mode to watch for changes.
 
    ```sh
        yarn start:dev
    ```

## DATABASE SEEDING.
For quicker testing, you can seed the db with sample brands with `yarn run db:seed`.

- Visit http://localhost:3000 on your HTTP client to test
- API documentation in docs.md

