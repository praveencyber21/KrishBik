# KrishBik - Bike Service Booking Web Application

  **KrishBik** is a web application for booking bike services. It provides a user-friendly interface for customers to book bike services easily.

## Technologies Used

- **Frontend:** HTML, CSS
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Dependencies:** 
 
- This project relies on the following dependencies:

**1. bcrypt:** Version 5.1.1
**2. cookie-parser:** Version 1.4.6
**3. express: Version** 4.18.2
**4. express-session:** Version 1.17.3
**5. mysql:** Version 2.18.1
**6. nodemailer:** Version 6.9.7
**7. uuid:** Version 9.0.1

## Database Configuration

Make sure to set up your MySQL database with the following details:

- **Host:** `localhost`
- **User:** `praveen404`
- **Password:** `praveen_404`
- **Database Name:** `cartrabbit`
- **Note:** Please use admin email and password as '**email: admin@gmail.com**', '**password: admin**'
  
**database schema for the **cartrabbit** database **
`**users` Table:**
* email (Primary Key)
* user_name
* mobile
* password
   
**`bookings` Table:**
* id (Primary Key)
* email (Foreign Key referencing users.email)
* bike
* service
* status

**Here's a breakdown of each table's schema:**

**users Table:**
* **email:** Primary key, unique identifier for each user.
* **user_name:** The name of the user.
* **mobile:** The mobile number of the user.
* **password:** The password associated with the user's account.
* **bookings Table:**
* **id:** Primary key, unique identifier for each booking.
* **email:** Foreign key referencing the users.email column, establishing a relationship between bookings and users. It represents the email of the user who made the booking.
* **bike:** Information related to the booked bike.
* **service:** Details about the service being booked.
* **status:** The status of the booking, indicating whether it's confirmed, pending, etc.

## Installation

To run this project locally, follow these steps:

1. Clone the repository: `https://github.com/praveencyber21/KrishBik.git`
2. Navigate to the project directory: `cd KrishBik`
3. Install dependencies: `npm install express bcrypt mysql nodemailer cookie-parser express-session uuid`
4. Start the server: `node server`

##  Run the application:

 - **node server**
* The application will be accessible at **http://localhost:3500**.

##  User usage
**1.User Registration:**

* Visit the registration page and create an account.
* Provide necessary details and your email address.
  
**2.User Login:**

* Log in to your account using your credentials.
  
**3.Service Booking:**
  
* Navigate to the booking page.
* Select the type of service required, preferred date, and time.

**4.User access:**

* See the status of his booking.
* Receive an email as soon as his booking is ready for delivery.
  
##  Admin usage
**1. Admin login:**

* Log in to admin account using admin credentials.

**2. Admin access:**

* View a list of all bookings (pendings, ready for delivery and completed).
* Mark a booking as ready for delivery.
* Mark a booking as completed.
* Receive an email whenever a booking is made.
  
## Contributing
  Contributions are welcome! If you find any bugs or want to improve the application, feel free to open an issue or submit a pull request.

## License
This project is licensed under the MIT License.
