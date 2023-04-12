
//Code inspired from w3schools.com, bootsnip.com and  https://youtu.be/4fWWn2Pe2M
// unzip the file and run the server.js file in the terminal using (node server.js) command to start the server
//Mohammed Alkharusi
//12/03/2023

var http = require("http");
var url = require("url");
var querystring = require("querystring"); //parse query string
var fs = require("fs"); //file system
var port = 8000;
var mysql = require("mysql");
var server = http.createServer();
const { v4: uuidv4 } = require('uuid'); //generate unique id

var con = mysql.createConnection({ //connect to database
    host: "localhost",
    user: "database user",
    password: "password",
    database: "database name"
});



// create the server and listen on port 8080
var server = http.createServer(function (request, response) {
    console.log("in request");
    var currentRoute = request.url.toString().split("?")[0]; //get the route
    var currentMethod = request.method; //get the method
    var requestBody = ""; // get the body
    if (request.method === 'OPTIONS') { //handle CORS
        response.writeHead(200, { //send response
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Content-Type': 'application/json'
        }); //end response header
        response.end();
        return;
    }

    //R (read) - get user record from
    if (currentRoute == "/api/user") {
        //create the customer details query
        if (currentMethod === "POST") {
            request.on("data", function (section) {
                requestBody += section.toString();
            });
            //get the content type
            const { headers } = request;
            let ctype = headers["content-type"];
            console.log("RECEIVED Content-Type: " + ctype);


            request.on("end", function () {
                const id = uuidv4(); //increase private key in this case CID
                var userData = ""; //get the user
                if (ctype.match(new RegExp("^application/x-www-form-urlencoded"))) {
                    userData = querystring.parse(requestBody);
                } else {
                    userData = JSON.parse(requestBody);
                }

                console.log("Data entered: " + JSON.stringify(userData, null, 2) + "\n"); //print the data entered
                // insert the customer details
                var insertUI = `INSERT INTO customers (CID, Title, FirstName, LastName, MobileNumber, EmailAddress) VALUES ('${id}','${userData.Title}','${userData.FirstName}', '${userData.LastName}','${userData.MobileNumber}','${userData.EmailAddress}')`;
                con.query(insertUI, function (err, result) {
                    if (err) throw err;
                    console.log("User Information Inserted");
                });
                // insert the customer home address
                var insertUHA = `INSERT INTO home (CID, AddressLine1, AddressLine2, Town, County, Eircode) VALUES ('${id}','${userData.AddressLine1}','${userData.AddressLine2}', '${userData.Town}','${userData.County}','${userData.Eircode}')`;
                con.query(insertUHA, function (err, result) {
                    if (err) throw err;
                    console.log("User home Address Inserted");
                });
                // insert the customer shipping address
                var insertUSA = `INSERT INTO shipping (CID, AddressLine1, AddressLine2, Town, County, Eircode) VALUES ('${id}','${userData.AddressLine1}','${userData.AddressLine2}', '${userData.Town}','${userData.County}','${userData.Eircode}')`;
                con.query(insertUSA, function (err, result) {
                    if (err) throw err;
                    console.log("User shipping Address Inserted");
                });
                // send the response
                var headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };
                response.writeHead(200, headers);
                response.end("User (" + userData.FirstName + " " + userData.LastName + ") data added to the Database!");
            });
        }
        // delete the customer record from the database 
        else if (currentMethod === "DELETE") {
            request.on("data", function (section) {
                requestBody += section.toString();
            });

            request.on("end", function () {
                var userData = JSON.parse(requestBody);
                console.log("Data to delete: " + JSON.stringify(userData, null, 2) + "\n");

                // Get the CID of the user to be deleted
                var getCIDQuery = `SELECT CID FROM customers WHERE
    LOWER(TRIM(FirstName))=LOWER(TRIM('${userData.FirstName}')) AND
    LOWER(TRIM(LastName))=LOWER(TRIM('${userData.LastName}')) AND
    LOWER(TRIM(EmailAddress))=LOWER(TRIM('${userData.EmailAddress}')) AND
    LOWER(TRIM(MobileNumber))=LOWER(TRIM('${userData.MobileNumber}'))`;
                con.query(getCIDQuery, function (err, result) {
                    if (err) throw err;

                    if (result.length > 0) {
                        var CID = result[0].CID;

                        // Delete the customer data from the home and shipping tables
                        var deletehomeQuery = `DELETE FROM home WHERE CID='${CID}'`;

                        // Delete the user data from the customers table
                        con.query(deletehomeQuery, function (err, result) {
                            if (err) throw err;
                            console.log("User home Address Deleted");
                        });
                        var deleteshippingQuery = `DELETE FROM shipping WHERE CID='${CID}'`;
                        con.query(deleteshippingQuery, function (err, result) {
                            if (err) throw err;
                            console.log("User shipping Address Deleted");
                        });

                        // Delete the user data from the customers table
                        var deleteCustomerQuery = `DELETE FROM customers WHERE CID='${CID}'`;
                        con.query(deleteCustomerQuery, function (err, result) {
                            if (err) throw err;
                            console.log("User Data Deleted");
                            // send the response
                            var headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };
                            response.writeHead(200, headers);
                            response.end(JSON.stringify({ message: "User (" + userData.FirstName + " " + userData.LastName + ") data deleted from the Database!" }));
                        });
                    } else {
                        var headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };
                        response.writeHead(404, headers);
                        response.end(JSON.stringify({ message: "User (" + userData.FirstName + " " + userData.LastName + ") not found in the Database!" }));
                    }
                });
            });
        }

        // get all the customers from the database
        else if (currentMethod === "GET") {

            var headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };

            con.query(`SELECT customers.*, home.AddressLine1 AS homeAddressLine1, home.AddressLine2 AS homeAddressLine2, home.Town AS homeTown, home.County AS homeCounty, 
            home.Eircode AS homeEircode, shipping.AddressLine1 AS shippingAddressLine1, shipping.AddressLine2 AS shippingAddressLine2, shipping.Town AS shippingTown, 
            shipping.County AS shippingCounty, shipping.Eircode AS shippingEircode FROM customers LEFT JOIN home ON customers.CID = home.CID
             LEFT JOIN shipping ON customers.CID = shipping.CID`, function (err, result) {

                if (err) throw err;
                console.log(JSON.stringify(result, null, 2) + "\n");
                response.writeHead(200, headers);
                response.end(JSON.stringify(result));
            });

        }

    }
    // update the customer record in the database
    else if (currentMethod === "PUT") {
        const CID = currentRoute.split("/api/user/")[1];
        request.on("data", function (section) {
            requestBody += section.toString();
        });

        const { headers } = request;
        let ctype = headers["content-type"];
        console.log("RECEIVED Content-Type: " + ctype);

        request.on("end", function () {
            var updateData = "";

            if (ctype.match(new RegExp("^application/x-www-form-urlencoded"))) {
                updateData = querystring.parse(requestBody);
            } else {
                updateData = JSON.parse(requestBody);
            }

            console.log("Data to update: " + JSON.stringify(updateData, null, 2) + "\n");

            // Update the user details in the customers table
            var updateUC = `UPDATE customers SET MobileNumber='${updateData.UpdateMobileNumber}', EmailAddress='${updateData.UpdateEmailAddress}', Title='${updateData.UpdateTitle}' WHERE CID='${updateData.CID}'`;
            con.query(updateUC, function (err, result) {
                if (err) throw err;
                console.log("User Information Updated");
            });
            // Update the user home address in the home table
            if (updateData.homeAddressLine1 != "" && updateData.homeTown != "" && updateData.homeCounty != "") {
                var updateUHA = `UPDATE home SET AddressLine1='${updateData.homeAddressLine1}', AddressLine2='${updateData.homeAddressLine2}', Town='${updateData.homeTown}', County='${updateData.homeCounty}', Eircode='${updateData.homeEircode}' WHERE CID='${CID}'`;
                con.query(updateUHA, function (err, result) {
                    if (err) throw err;
                    console.log("User home Address Updated");
                });
            }
            // Update the user shipping address in the shipping table
            if (updateData.shippingAddressLine1 != "" && updateData.shippingTown != "" && updateData.shippingCounty != "") {
                var updateUSA = `UPDATE shipping SET AddressLine1='${updateData.shippingAddressLine1}', AddressLine2='${updateData.shippingAddressLine2}', Town='${updateData.shippingTown}', County='${updateData.shippingCounty}', Eircode='${updateData.shippingEircode}' WHERE CID='${CID}'`;
                con.query(updateUSA, function (err, result) {
                    if (err) throw err;
                    console.log("User shipping Address Updated");
                });
            }

            var headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };
            response.writeHead(200, headers);
            response.end("User (" + updateData.FirstName + " " + updateData.LastName + ") data updated in the Database!");
        });
    }

    // get the customer by first name from the database
    else if (currentRoute === "/api/user/search" && currentMethod === "GET") {
        var firstName = url.parse(request.url, true).query.firstName;
        var query = `SELECT 
                        customers.CID, 
                        customers.Title, 
                        customers.FirstName, 
                        customers.LastName, 
                        customers.MobileNumber, 
                        customers.EmailAddress, 
                        home.AddressLine1 as homeAddressLine1, 
                        home.AddressLine2 as homeAddressLine2, 
                        home.Town as homeTown, 
                        home.County as homeCounty, 
                        home.Eircode as homeEircode, 
                        shipping.AddressLine1 as shippingAddressLine1, 
                        shipping.AddressLine2 as shippingAddressLine2, 
                        shipping.Town as shippingTown, 
                        shipping.County as shippingCounty, 
                        shipping.Eircode as shippingEircode 
                    FROM customers 
                    LEFT JOIN home ON customers.CID = home.CID 
                    LEFT JOIN shipping ON customers.CID = shipping.CID 
                    WHERE LOWER(FirstName) LIKE LOWER('%${firstName}%')`;
        var headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };
        con.query(query, function (err, result) {
            if (err) throw err;
            console.log(JSON.stringify(result, null, 2) + "\n");
            response.writeHead(200, headers);
            response.end(JSON.stringify(result));
        });
    }


    else {
        response.writeHead(404, { "Content-Type": "text/plain" });
        response.end("404 - Page not found");
    }

});
// Start the server
fs.readFile("./index.html", function (err, html) {
    if (err) {
        throw err;
    }
    http.createServer(function (request, response) {
        response.writeHeader(200, { "Content-Type": "text/html" });
        response.write(html);
        response.end();
    })
});
server.listen(port, function () {
    console.log("Server listening on: http://localhost:%s", port);
});

//data daumb for testing
con.connect(function (err) {
    if (err) throw err;

    var customerTable = `CREATE TABLE IF NOT EXISTS customers (
        CID varchar(36) NOT NULL,
        Title varchar(5) DEFAULT NULL,
        FirstName varchar(100) DEFAULT NULL,
        LastName varchar(100) DEFAULT NULL,
        MobileNumber varchar(20) DEFAULT NULL,
        EmailAddress varchar(100) DEFAULT NULL,
        PRIMARY KEY (CID)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`

    var homeTable = `CREATE TABLE IF NOT EXISTS home (
        CID varchar(36) NOT NULL,
        AddressLine1 varchar(100) DEFAULT NULL,
        AddressLine2 varchar(100) DEFAULT NULL,
        Town varchar(100) DEFAULT NULL,
        County varchar(100) DEFAULT NULL,
        Eircode varchar(10) DEFAULT NULL,
        PRIMARY KEY (CID),
        CONSTRAINT home_ibfk_1 FOREIGN KEY (CID) REFERENCES customers (CID) ON DELETE CASCADE ON UPDATE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`

    var shippingTable = `CREATE TABLE IF NOT EXISTS shipping (
        CID varchar(36) NOT NULL,
        AddressLine1 varchar(100) DEFAULT NULL,
        AddressLine2 varchar(100) DEFAULT NULL,
        Town varchar(100) DEFAULT NULL,
        County varchar(100) DEFAULT NULL,
        Eircode varchar(10) DEFAULT NULL,
        PRIMARY KEY (CID),
        CONSTRAINT shipping_ibfk_1 FOREIGN KEY (CID) REFERENCES customers (CID) ON DELETE CASCADE ON UPDATE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`

    con.query(customerTable, function (err, result) {
        if (err) throw err;
        console.log("Customer table created");
    });

    con.query(homeTable, function (err, result) {
        if (err) throw err;
        console.log("Home table created");
    });

    con.query(shippingTable, function (err, result) {
        if (err) throw err;
        console.log("Shipping table created");
    });

    //create user record and add to database
    if (err) throw err;
    // add first user information
    var insertCustomers = `INSERT INTO customers (CID, Title, FirstName, LastName, MobileNumber, EmailAddress)
    VALUES
    ('1','Ms','Sara','Mac','081234567','SaraMa@email.com'),
    ('2','Mr','Mark','None','08212340','Markn@email.com'),
    ('3','Ms','Nicole','Nollan','08330828','NicoleN@email.com')
    ON DUPLICATE KEY UPDATE CID =CID`;
    con.query(insertCustomers, function (err, result) {
        if (err) throw err;
        console.log("Customers inserted");
    });

    //add home address for first user
    var insertHome = `INSERT INTO home (CID, AddressLine1, AddressLine2, Town, County, Eircode) 
    VALUES
    ('1','1 Main Street','Main Street','Dublin','Dublin','D01 D123'),
    ('2','2 Main Street','Main Street','Dublin','Dublin','D02 D123'),
    ('3','3 Main Street','Main Street','Dublin','Dublin','D03 D123')
    ON DUPLICATE KEY UPDATE CID =CID`;
    con.query(insertHome, function (err, result) {
        if (err) throw err;
        console.log("Home inserted");
    });

    //add shipping address for first user
    var insertShipping = `INSERT INTO shipping (CID, AddressLine1, AddressLine2, Town, County, Eircode)
    VALUES
    ('1','1 Main Street','Main Street','Dublin','Dublin','D01 D123'),
    ('2','2 Main Street','Main Street','Dublin','Dublin','D02 D123'),
    ('3','3 Main Street','Main Street','Dublin','Dublin','D03 D123')
    ON DUPLICATE KEY UPDATE CID =CID`;
    con.query(insertShipping, function (err, result) {
        if (err) throw err;
        console.log("Shipping inserted");
    });



    //select and supply all users matching a supplied name
    var name = "Sara";
    con.query("SELECT * FROM customers WHERE FirstName = " + mysql.escape(name), function (err, result) {
        if (err) throw err;
        console.log("retrieve all users matching a supplied name");
        console.log("" + result[0].Title + " " + result[0].FirstName + " " + result[0].LastName + " " + result[0].MobileNumber + " " + result[0].EmailAddress);
    });

    //update three elements of a specified user record (Phone, Email, Title) and all or any of their Address data.
    con.query("Update customers SET MobileNumber = '089893233', EmailAddress= 'Sara2243@email.com', Title = 'Ms' WHERE CID ='1'", function (err, result) {
        if (err) throw err;
        console.log("1 Customer information updated");

    });
    con.query("Update home SET AddressLine1 = 'Apartment 111', AddressLine2= 'Street111', Eircode = 'D21FR23' WHERE CID ='1'", function (err, result) {
        if (err) throw err;
        console.log("1 Customer home address updated");

    });
    con.query("Update shipping SET AddressLine1 = 'Apartment 111', AddressLine2= 'Street111', Eircode = 'D21FR23' WHERE CID ='1'", function (err, result) {
        if (err) throw err;
        console.log("1 Customer shipping address updated ");

    });

    //D(delete) all records for a user matching a combination of Email Phone and Name
    con.query("SELECT * FROM customers WHERE EmailAddress = 'NicoleN@email.com' AND MobileNumber = '08330828' AND FirstName = 'Nicole' ", function (err, result) {
        if (err) throw err;
        con.query("DELETE FROM customers WHERE CID ='3'", function (err, result) {
            if (err) throw err;
            console.log("1 customer information deleted");
        });

    });



}); //end of data dumb










