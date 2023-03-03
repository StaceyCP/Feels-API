# Feels API

## Introduction

Feels API is an interactive API that stores mood tracking data and facilitates a bidirectional chat facility between users and registered health professionals via the Feels mood tracking app. Clients can add themselves to the API as a user or as a registered health professional. The API uses MongoDB to store mood information linked to each user and keep a record of their chats with professionals. Users waiting to chat are stored in the API's waiting room endpoint.

## URL

The production version of Feels API is hosted via Render and can be accessed at the following URL:

https://feels-api.onrender.com/api/

## Features

- Add new users or registered professionals via **POST** requests.
- Access a user and their linked mood tracking data via their username using **GET** requests.
- Use **POST** requests to initiate user mood tracking data.
- Use **PATCH** requests to update a user's mood tracking data daily.
- Access a professional via their registration number using **GET** requests.
- Update a professional's working hours using **PATCH** requests.
- Add users to the waiting room using **POST** requests.
- Professionals can view the waiting room using **GET** requests.
- Professionals can remove users from the waiting room when picked up using **DELETE** requests.

## Installation Guide

1. Clone this repository to your local machine via your terminal using command _'git clone https://github.com/StaceyCP/Feels-API'_ in your chosen directory location.

2. Run _'npm install'_ to install all dependencies. You will need:

   > - **cors** _v2.8.5_
   > - **dotenv** _v16.0.0_
   > - **express** _v4.18.2_
   > - **husky** _v8.0.3_
   > - **mongoose** _v6.9.2_
   > - **nodemon** _v2.0.20_
   > - **socket.io** _v4.6.1_
   > - **jest** _v29.4.3_
   > - **supertest** _v6.3.3_
   > - **jest-sorted** _v1.0.14_
   > - **jest-extended** _v3.2.4_

3. Create the following environment variables to allow for the API to access the development and test databases:

> - **.env.development** - Add command _'mongodb://127.0.0.1:27017/feels-data'_ to set access to a developer database.
>
> - **.env.test** - Add command _'MONG_URI=mongodb://127.0.0.1:27017/feels-test-data'_ to set access to the test database when Jest is running.

4. Use command _'npm run seed'_ to seed your local development database.

5. Test features using jest via command _'npm test'_.

6. Use command _'npm run start'_ to start the app on local port 9090. Software such as Insomnia can then be used to test app features on the development database.
