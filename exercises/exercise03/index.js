const employees = require("./Employee");
const http = require("http");

console.log("Lab 03 - NodeJs");

// Define server port
const port = process.env.PORT || 8081;

// Create web server
const server = http.createServer((req, res) => {
    // Reject methods other than GET
    if (req.method !== "GET") {
        res.writeHead(405, {
            "Content-Type": "application/json",
            "Allow": "GET"
        });
        res.end(JSON.stringify({ error: http.STATUS_CODES[405] }));
        return;
    }

    // Return welcome message
    if (req.url === "/") {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end("<h1>Welcome to Lab Exercise 03</h1>");
        return;
    }

    // Return all employee details
    if (req.url === "/employee") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(employees));
        return;
    }

    // Return employee full names in ascending order
    if (req.url === "/employee/names") {
        const names = employees
            .map(employee => `${employee.firstName} ${employee.lastName}`)
            .sort();

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(names));
        return;
    }

    // Return total employee salary
    if (req.url === "/employee/totalsalary") {
        let totalSalary = 0;

        for (const employee of employees) {
            totalSalary += employee.Salary;
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ total_salary: totalSalary }));
        return;
    }

    // Return an error for an unknown URL
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: http.STATUS_CODES[404] }));
});

// Start server
server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});