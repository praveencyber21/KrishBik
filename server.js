//Welcome to server
// import necessory modules

const express = require('express')
const app = express ()
const path = require('path')
const mysql = require('mysql')
const PORT =  process.env.PORT || 3500
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const expressSession = require('express-session');
const cookieParser = require('cookie-parser');
const uuid = require('uuid');

// Secret key session
const secretKey = uuid.v4();

// configure and use session middleware
app.use(cookieParser());
app.use(expressSession({
    secret: secretKey, 
    resave: false,
    saveUninitialized: true
}));



app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(express.static(path.join(__dirname, './css')))
app.use(express.static(path.join(__dirname, './images')))

// Create database connection
const database = mysql.createConnection({
    host:'localhost',
    user:'praveen404',
    password:'praveen_404',
    database:'cartrabbit',
});


// Check database connected or not
database.connect((error) =>{
    if(error){
        console.log(error)
    } else{
        console.log("*** Database connected....")
    }
})



//Home route (index.html)
app.get('^/$|/index(.html)?', (req, res)=>{
    res.sendFile(path.join(__dirname, 'index.html'))
})

//Register route (register.html)
app.get('/register(.html)?', (req, res)=>{
    res.sendFile(path.join(__dirname, 'register.html'))
})

// Admin page route (admin-home-page.html)
app.get('/admin-home-page(.html)?', (req, res) => {
    // Check if the user has an active session
    if (req.session.admin) {
        // User has an active session, allow access to the admin page
        res.sendFile(path.join(__dirname, 'admin-home-page.html'));
    } else {
        // User doesn't have an active session, redirect to the login page
        res.sendFile(path.join(__dirname, 'index.html'));
    }
});
//User page rout (user-home-page.html)
app.get('/user-home-page(.html)?', (req, res) => {
    // Check if the user has an active session
    if (req.session.user) {
        // User has an active session, allow access to the user home page
        res.sendFile(path.join(__dirname, 'user-home-page.html'));
    } else {
        // User doesn't have an active session, redirect to the login page
        res.sendFile(path.join(__dirname, 'index.html'));
    }
})

// Booking page route
app.get('/booking-page(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, './booking-page.html'));
})

//Pending page
app.get('/pending-page(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'pending-page.html'))
})
//Ready page
app.get('/ready-page(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'ready-page.html'))
})
//Completed page
app.get('/completed-page(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'completed-page.html'))
})

//Login
app.post('/login', (req, res) => {
    try {
        const { email, password } = req.body;

        // Check email and password are provided
        if (!email || !password) {
            console.log("   => Enter email and password");
            return res.status(400).sendFile(path.join(__dirname, 'index.html'));
        }

        database.query('SELECT * FROM users WHERE email=?', [email], async (error, result) => {
            if (error) {
                console.log(error);
                return res.status(500).send('Internal server error');
            }

            // Check email exists or not
            if (result.length <= 0) {
                console.log("    => Please sign up");
                return res.sendFile(path.join(__dirname, 'register.html'));
            }

            // Verify password
            const isPasswordValid = await bcrypt.compare(password, result[0].password);

            if (isPasswordValid) {
                // Check if the user is an admin
                if (result[0].email === 'admin@gmail.com' && password === 'admin') {
                    // Admin login
                    req.session.admin = true;
                    req.session.user = {
                        id: result[0].id,
                        email: result[0].email,
                    };
                    return res.sendFile(path.join(__dirname, 'admin-home-page.html'));
                } else {
                    // Regular user login
                    req.session.user = {
                        id: result[0].id,
                        email: result[0].email,
                        name: result[0].name
                    };
                    res.sendFile(path.join(__dirname, 'user-home-page.html'))

                }
            } else {
                console.log("   => Wrong password");
                return res.sendFile(path.join(__dirname, 'index.html'));
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal server error');
    }
});


//Register button
app.post('/register', async (req, res)=>{
    
   
    try{
        const {name, email, mobile, password, cpassword} = req.body;
        database.query('SELECT email FROM users WHERE email = ?', [email], async (error, result)=>{
            if(error){
                confirm.log(error)
            }

        //Check email is existed or not
        if(result.length > 0){

            return res.sendFile(path.join(__dirname, 'register.html'))
        }
        //Check if password and confirm password 
        if(password !== cpassword){
            
            return res.sendFile(path.join(__dirname, 'register.html'))
        }

        //Hash the password

        const hashedPassword = await bcrypt.hash(password, 8);

        //Insert user data with hashed password
        await database.query('INSERT INTO users VALUES(?, ?, ?, ?)', [name, email, mobile, hashedPassword])

        console.log('User registered successfully')
        return res.sendFile(path.join(__dirname, 'index.html'))
        })
    }catch(error){
        if(error){
            console.log(error)
            return res.send("Internal server error")
        }
    }


});

// Booking
app.post('/booknow', (req, res) => {
    const { bikes, services, email, datetime } = req.body;
    // Create a transporter using Gmail's SMTP server
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'krishbikservice@gmail.com',
            pass: 'tpwg zcrs dtym ozdk',
        },
    });

    // Email data
    const mailOptions = {
        from: 'krishbikservice@gmail.com',
        to: 'krishbikservice@gmail.com',
        subject: 'Booking Confirmation',
        text: `Hello admin!, "${email}" have booked "${bikes}" for "${services}" service on "${datetime}".`
    };

    database.query('INSERT INTO bookings (email, bikes, services, dateandtime) VALUES (?, ?, ?, ?)', [email, bikes, services, datetime], (error, result) =>{
        if(error){
            console.log(error)
            return res.status(500).json({error: 'Database error'});
        } else {
            transporter.sendMail(mailOptions, (error, info) => {
                if(error) {
                    console.error('Error sending email:', error);
                    res.status(500).json({error: 'email sending failed'});
                } else {
                    
                    res.json({message: 'Mail  successfully sent to admin.'});
                }
            });
        }
    })

   
});
// All status
app.get('/all-status', (req, res) => {

    database.query(`SELECT * FROM bookings`, (error, results, fields) => {
      if (error) throw error;
        //res.sendFile(path.join(__dirname, 'pending-bookings.html'))
        
        res.json({ allStatus: results });
    });
  });
// Pending status
app.get('/pending-bookings', (req, res) => {

    database.query(`SELECT * FROM bookings WHERE  status = "pending"`, (error, results, fields) => {
      if (error) throw error;
        //res.sendFile(path.join(__dirname, 'pending-bookings.html'))
        res.json({ pendingBookings: results });
    });
  });
// Ready status
app.get('/ready-bookings', (req, res) => {
   
    database.query(`SELECT * FROM bookings WHERE status = "ready"`, (error, results, fields) => {
      if (error) throw error;
        //res.sendFile(path.join(__dirname, 'pending-bookings.html'))
        res.json({ readyBookings: results });
    });
  });
// Completed status
app.get('/completed-bookings', (req, res) => {
    database.query(`SELECT * FROM bookings WHERE status = "completed"`, (error, results, fields) => {
      if (error) throw error;
        //res.sendFile(path.join(__dirname, 'pending-bookings.html'))
        res.json({ completedBookings: results });
    });
  });
  // API endpoint to mark booking as "Pending"
app.post('/mark-as-pending', (req, res) => {
    console.log(req.body);
    const id = req.body.id;
    database.query(`UPDATE bookings SET status = 'pending' WHERE id = ?`, [id], (error, result) => {
        if(error){
            console.log(error)
        } else {
            res.send("Pending updated")
        }
    });
});

// Mark as ready
app.post('/mark-as-ready', async (req, res) => {
    
    const email = req.body.id; 

    // Update the status to 'ready' in the database
    database.query('UPDATE bookings SET status = "ready" WHERE email = ?', [email], async (error, result) => {
        if (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        } else {
            // Create a transporter using Gmail's SMTP server
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'krishbikservice@gmail.com', // Sender's email address
                    pass: 'tpwg zcrs dtym ozdk',    // Sender's email password
                },
            });

            // Email data
            const mailOptions = {
                from: 'krishbikservice@gmail.com',
                to: email, // User's email address retrieved from the database
                subject: 'Service ready',
                text: `Hello ${email},
                \n\nYour booking has been marked as ready. Thank you for using our service!
                \n\nRegards,
                \nThe Admin Team`
            };

            try {
                // Send email to the user
                await transporter.sendMail(mailOptions);
                res.send('Status updated to "ready" and Email sent successfully');
            } catch (error) {
                console.error('Error sending email:', error);
                res.status(500).send('Internal Server Error');
            }
        }
    });
});

// Mark as completed/
app.post('/mark-as-completed', async(req, res) => {
    const id = req.body.id;
    console.log(id);
    database.query(`UPDATE bookings SET status = 'completed' WHERE id = ?`, [id], async (error, result) => {
        if (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        } else {
            
        }
         
    });
});
// User status in user home page
app.get('/user-status', (req, res) => {
    try {
        // Check if the user is logged in
        if (!req.session.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const userEmail = req.session.user.email;

        // Query the database to get the user name and status details for the user
        database.query('SELECT name FROM users WHERE email = ?', [userEmail], (error, nameResult) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Internal server error' });
            }

            // Query the database to get status details for the user
            database.query('SELECT * FROM bookings WHERE email = ?', [userEmail], (error, results) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                // Send the user name and status details to the client
                res.status(200).json({ userName: nameResult[0].name, userStatus: results });
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Logout
app.post('/logout', (req, res) => {
    try {
        // Destroy the session
        req.session.destroy((error) => {
            if (error) {
                console.log(error);
                return res.status(500).send('Internal server error');
            }
            // Redirect to the login page after destroying the session
            return res.sendFile(path.join(__dirname, 'index.html'));
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal server error');
    }
});


//Listen the port
app.listen(PORT, () => console.log(`*** Server running @ ${PORT}....`))