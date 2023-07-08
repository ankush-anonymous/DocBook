require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const cors = require("cors");

//connectDB
const connectDB = require("./db/connect");
const authenticateUser = require("./middleware/authentication");

//routers
const SlotRouter = require("./routes/Slots");
const AuthRouter = require("./routes/auth");
const UserRouter = require("./routes/User");
const AdminRouter = require("./routes/adminAuth");
const AppointmentRouter = require("./routes/appointment");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(express.json());
app.use(cors());
// extra packages

// routes
app.use("/api/v1/admin", AdminRouter);
app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/slots", authenticateUser, SlotRouter);
app.use("/api/v1/user", UserRouter);
app.use("/api/v1/appointment", authenticateUser, AppointmentRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
