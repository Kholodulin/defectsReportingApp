# Defect Request Receipt Service 🛠️

This is an application for managing defect requests for construction projects.
It allows construction site managers to receive defect reports
and provides clients with an interface for submitting their requests.

## Main Features

### Manager 👔

- Create, view, edit, and delete construction projects.
- Display a list of received requests and a list of objects with filtering and pagination.
- View a list of requests with details and change the status of requests (reject or complete).

### User 🧑

- Fill out a form to submit a defect request
- Receive a link to track the status of a submitted request.

## Quick Access

📧 Email: mail@mail.ru
🔑 Password: 12345678

## Screenshots

#### Submit Request

![submit_request](https://github.com/Kholodulin/defectsReportingApp/assets/90597757/b01e6543-3490-42a6-8e3f-b51088484d45)

#### View applications

![requests-list](https://github.com/Kholodulin/defectsReportingApp/assets/90597757/900bda17-81e4-4bd9-aa2b-2ea59872f714)

## Installation and Launch

Requirements:
Node.js and npm
Angular 17 CLI (npm install -g @angular/cli@17)
1. Installation and configuration:
   ```sh
    git clone https://github.com/Kholodulin/defectsReportingApp.git
    cd defectsReportingApp
    npm install
   ```
2. Start the Express server:
   ```sh
    npm run express
   ```
3. Run the Angular application:
   ```sh
   ng serve
   ```
4. Follow the link in your browser http://localhost:4200
