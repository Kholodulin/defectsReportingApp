# DefectReportingApp

Angular application for managing requests for eliminating construction defects. 
The application has two roles: a construction company manager and a user submitting a request.

## Installation and Setup

Requirements

1. Node.js and npm
2. Angular 17 CLI (npm install -g @angular/cli)
3. JSON Server (npm install -g json-server)

Instructions

1. Clone the repository:
    ```sh
    git clone https://github.com/Kholodulin/defectsReportingApp.git
    cd construction-defect-management
    ```
2. Install the dependencies:
   ```sh
    npm install
    ```
3. Start JSON Server:
   ```sh
    json-server --watch db.json
    ```
4. Start the Angular application:
    ```sh
    ng serve
    ```
5. Open your browser and navigate to http://localhost:4200

## Technologies Used

1. Angular
2. TypeScript
3. JSON Server
4. HTML/CSS
