# WorkOrder
Chevron's real-time work order scheduling optimization website.

# Background
Chevron has large scale operations and complex process facilities (refineries and liquified natural gas production facilities). Scheduling work orders on these facilities with differing repair requirements, specialized technicians, and potentially hours of drive time between locations can be difficult.

# Challenge
Build a work order tracking system that tracks:

(1) the work orders that are submitted

(2) the technicians that are completing them to optimize how technicians are assigned and work orders are completed. 

Knowing where technicians are, what they are certified/qualified to repair, how long they are planning to being there, other work orders in the same or nearby location, etc will be *invaluable* in being able to dynamically schedule and dispatch existing and new work orders to technicians at the beginning of the day and while onsite. Updating each technician with their schedule of work orders can be done through any means of mobile technology, SMS, call, mobile app, etc.

# Run Instructions
Start up servio
```
ssh -R hackrice:80:localhost:8000 serveo.net
```

Install dependencies (assuming you have npm installed)
```
npm install
```

Start server
```
npm run server
```

Start client
```
npm run client
```

# General Structure

We have a server instance that runs on localhost:8000, it connects to an aws store bootstrapped with mlab managed with mongodb. We also have a client that runs on localhost:3000, it is built on ReactJS and uses axios to route to the endpoints exposed on our server. We also take use of Twilio's API for two way communication with technicians.

# Testing Server Code

There are a LOT of endpoints for this project. The primary routes you might want to use to ping our endpoints with Postman or curl during development are:
submitting a new worker/technician application: `/worker_submission`

getting all available workers: `/workers`

submitting a new work order form: `/workorder_submission`

getting all available work orders: `/workers`

Additionally, we have a number of buttons on our demo tab that are connected to useful endpoints to play around with our platform.