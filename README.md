
# GoConnect - Ride Hailing Application

GoConnect is a full-stack ride hailing application built with React, Node.js, Express, MongoDB and Socket.IO.

## Features

- Real-time ride tracking
- User and Driver authentication 
- Google Maps integration
- Socket-based live location updates
- OTP verification for rides
- Multiple vehicle types support (Car, Auto, Bike)
- Fare estimation based on distance

## Installation

### Prerequisites

- Node.js 20+
- MongoDB
- Google Maps API key

### Setting up the Backend

1. Clone the repository
```bash
git clone https://github.com/yourusername/goconnect.git
cd goconnect
```

2. Install server dependencies
```bash
cd server
npm install
```

3. Create `.env` file in server directory with following variables:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/goconnect
JWT_SECRET=your_jwt_secret
GOOGLE_MAP_API=your_google_maps_api_key
```

4. Start the server
```bash
npm run dev
```

### Setting up the Frontend

1. Install client dependencies
```bash
cd client
npm install
```

2. Create `.env` file in client directory:
```env
VITE_BASE_URL=http://localhost:3000
VITE_GOOGLE_MAP_API=your_google_maps_api_key
```

3. Start the client
```bash
npm run dev
```

## API Documentation

### Authentication Endpoints

#### User Authentication

##### Register User
```http
POST /users/register
```
Request Body:
```json
{
  "fullname": {
    "firstname": "string",
    "lastname": "string"
  },
  "email": "string",
  "password": "string"
}
```

##### Login User
```http
POST /users/login
```
Request Body:
```json
{
  "email": "string",
  "password": "string"
}
```

#### Driver Authentication

##### Register Driver
```http
POST /drivers/register
```
Request Body:
```json
{
  "fullname": {
    "firstname": "string",
    "lastname": "string"
  },
  "email": "string",
  "password": "string",
  "vehicle": {
    "plate": "string",
    "capacity": "number",
    "vehicleType": "car|auto|moto"
  }
}
```

##### Login Driver
```http
POST /drivers/login
```
Request Body:
```json
{
  "email": "string",
  "password": "string"
}
```

### Ride Endpoints

##### Get Fare Estimate
```http
GET /ride/get-fare
```
Query Parameters:
- pickup: string
- destination: string

##### Create Ride
```http
POST /ride/create
```
Request Body:
```json
{
  "pickup": "string",
  "destination": "string",
  "vehicleType": "car|auto|moto"
}
```

##### Confirm Ride
```http
POST /ride/confirm
```
Request Body:
```json
{
  "rideId": "string"
}
```

##### Start Ride
```http
GET /ride/start-ride
```
Query Parameters:
- rideId: string
- otp: string

##### End Ride
```http
POST /ride/end-ride
```
Request Body:
```json
{
  "rideId": "string"
}
```

### Map Services

##### Get Location Coordinates
```http
GET /map/get-coordinates
```
Query Parameters:
- address: string

##### Get Distance & Time
```http
GET /map/get-distance-time
```
Query Parameters:
- origin: string
- destination: string

##### Get Address Suggestions
```http
GET /map/get-suggestion
```
Query Parameters:
- input: string

## Socket Events

### Client Events

- `join`: Emitted when user/driver connects with {userId, userType}
- `update-location-driver`: Emitted by driver to update location

### Server Events

- `new-ride`: Emitted to nearby drivers when new ride is created
- `ride-confirmed`: Emitted to user when driver accepts ride
- `ride-started`: Emitted to user when ride starts
- `ride-ended`: Emitted to user when ride ends

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

