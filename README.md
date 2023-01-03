# Social-Network-Server

## Table of Contents

- [Install](#install)
- [Introduction](#introduction)
- [Api Schema](#api-schema)
    - [URL Schema](#url-Schema)
- [Databases](#databases)
    - [Schema](#database-schema)
- [Installation](#installation)
    - [Configuration](#configuration)
    - [Running the app](#running-the-app)
    - [Test](#test)
- [License](#license)

## Install

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/).

Before installing, [download and install Node.js](https://nodejs.org/en/download/). Node.js 0.6 or higher is required.

Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

Now download and extract project
[Direct link](https://github.com/TREER00T/Social-Network-Server/archive/refs/heads/main.zip)

## Introduction

A simple social network with socket.io and rest api in nest.js

## Api Schema

In this project, two libraries are used for documentation and display and display with api. For Restful
Api ([swagger](https://github.com/scottie1984/swagger-ui-express)) and For
Socket.io ([OpenRTP](https://github.com/treegex/openrtp))

### URL Schema

**Rest Api** =>
`http://localhost:3000/apiDocs`

**Socket.io** =>
`http://localhost:17892/socket-docs`

## Database

This app has used two databases (mongodb, redis) for development

### Schema

For more information about the database structure, refer to [this](https://github.com/TREER00T/Social-Network-Database)
repository

## Installation

```bash
$ npm i
```

## Configuration

Open cmd and run the following commands.

```shell
node cmd.js serve
```

* Create new database with this name `social_network`
* Create new collection with this name `users`

You can change database and collection name in .env file and create your own database 

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Licensing

The code in this project is licensed under
the [MIT](https://github.com/TREER00T/Social-Network-Server/blob/main/LICENSE)
