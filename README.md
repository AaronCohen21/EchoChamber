# Project Echo Chamber

Your personal media streaming service that can be deployed anywhere!

![EchoChamber Logo](https://github.com/AaronCohen21/EchoChamber/assets/35773503/cbdacf07-ca4a-4b35-b78c-4e064384d7ad)

## Dev: Getting Started

To get started writing code you must first build dev-database Docker Image. This can be done by running `yarn db:build`. With the Docker Image built a local development server can be booted up using `yarn dev`. This will let you modify code in both the client and server applications and have changes hot-reload.

**NOTE:** You only need to run `yarn db:build` once unless you make any changes to the dev-database Docker Image.

### Windows Only

`yarn db:build` isn't very windows freindly since it exports db credentials from the `.env` file. If you want to build the Docker Image in a non \*NIX CLI run the following command and make sure all values match what you have set in your `.env` file.

```
docker build --build-arg POSTGRES_USER=<YOUR POSTGRES USERNAME> --build-arg POSTGRES_PASSWORD=<YOUR POSTGRES PASSWORD> --build-arg POSTGRES_DB=<YOUR POSTGRES DB NAME> -t echochamber-db . && docker volume create echochamber_db-data-dev
```
