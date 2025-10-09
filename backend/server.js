const express = require("express");
const cors = require("cors");
const http = require("http");
const connectDB = require("./db");
const path = require("path");
const { Server } = require("socket.io");
const Employee = require("./models/Employee");
const onlineEmployees = new Map();

const app = express();
const server = http.createServer(app);
const issues = [
  {
    issueId: '0001',
    solutions: [
      {
        id: 1,
        index: 10,
        solutionProposals: [
          {
            solutionType: 'Delay',
            legNo: 101,
            legDelayTime: 45,
            legAdjustedDeparture: '2024-01-27T11:00:00Z',
            legAdjustedArrival: '2024-01-27T12:00:00Z',
            legState: 'UX',
          },
          {
            solutionType: 'Delay',
            legNo: 102,
            legDelayTime: 45,
            legAdjustedDeparture: '2024-01-27T11:00:00Z',
            legAdjustedArrival: '2024-01-27T12:00:00Z',
            legState: 'UX',
          },
          {
            solutionType: 'Delay',
            legNo: 125,
            legDelayTime: 45,
            legAdjustedDeparture: '2024-01-27T11:00:00Z',
            legAdjustedArrival: '2024-01-27T12:00:00Z',
            legState: 'UX',
          },
          {
            solutionType: 'Delay',
            legNo: 126,
            legDelayTime: 45,
            legAdjustedDeparture: '2024-01-27T11:00:00Z',
            legAdjustedArrival: '2024-01-27T12:00:00Z',
            legState: 'UX',
          },
        ],
      },
      {
        id: 2,
        index: 6,
        solutionProposals: [
          {
            solutionType: 'Delay',
            legNo: 101,
            legDelayTime: 45,
            legAdjustedDeparture: '2024-01-27T11:00:00Z',
            legAdjustedArrival: '2024-01-27T12:00:00Z',
            legState: 'UX',
          },
          {
            solutionType: 'Cancel',
            legNo: 102,
            legDelayTime: 45,
            legAdjustedDeparture: '2024-01-27T11:00:00Z',
            legAdjustedArrival: '2024-01-27T12:00:00Z',
            legState: 'UX',
          },
        ],
      },
      {
        id: 3,
        index: 6,
        solutionProposals: [
          {
            solutionType: 'Cancel',
            legNo: 101,
            legDelayTime: 45,
            legAdjustedDeparture: '2024-01-27T11:00:00Z',
            legAdjustedArrival: '2024-01-27T12:00:00Z',
            legState: 'UX',
          },
          {
            solutionType: 'Cancel',
            legNo: 102,
            legDelayTime: 45,
            legAdjustedDeparture: '2024-01-27T11:00:00Z',
            legAdjustedArrival: '2024-01-27T12:00:00Z',
            legState: 'UX',
          },
          {
            solutionType: 'Cancel',
            legNo: 125,
            legDelayTime: 45,
            legAdjustedDeparture: '2024-01-27T11:00:00Z',
            legAdjustedArrival: '2024-01-27T12:00:00Z',
            legState: 'UX',
          },
          {
            solutionType: 'Cancel',
            legNo: 126,
            legDelayTime: 45,
            legAdjustedDeparture: '2024-01-27T11:00:00Z',
            legAdjustedArrival: '2024-01-27T12:00:00Z',
            legState: 'UX',
          },
        ],
      },
      {
        id: 4,
        index: 3,
        solutionProposals: [
          {
            solutionType: 'Delay',
            legNo: 101,
            legDelayTime: 45,
            legAdjustedDeparture: '2024-01-27T11:00:00Z',
            legAdjustedArrival: '2024-01-27T12:00:00Z',
            legState: 'UX',
          },
          {
            solutionType: 'Delay',
            legNo: 102,
            legDelayTime: 45,
            legAdjustedDeparture: '2024-01-27T11:00:00Z',
            legAdjustedArrival: '2024-01-27T12:00:00Z',
            legState: 'UX',
          },
          {
            solutionType: 'Cancel',
            legNo: 125,
            legDelayTime: 45,
            legAdjustedDeparture: '2024-01-27T11:00:00Z',
            legAdjustedArrival: '2024-01-27T12:00:00Z',
            legState: 'UX',
          },
          {
            solutionType: 'Cancel',
            legNo: 126,
            legDelayTime: 45,
            legAdjustedDeparture: '2024-01-27T11:00:00Z',
            legAdjustedArrival: '2024-01-27T12:00:00Z',
            legState: 'UX',
          },
        ],
      },
    ],
  },
  {
    issueId: "0002",
    solutions: [
      {
        solutionType: "DELAY",
        legNo: 2002,
        legDelayTime: 60,
        legAdjustedDeparture: "2024-01-27T12:00:00Z",
        legAdjustedArrival: "2024-01-27T13:30:00Z",
        legState: "DLY",
      },
      {
        solutionType: "CANCEL",
        legNo: 1002,
        legDelayTime: 40,
        legAdjustedDeparture: "2024-01-27T10:30:00Z",
        legAdjustedArrival: "2024-01-27T10:30:00Z",
        legState: "CNL",
      },
    ],
  },
  {
    issueId: "0003",
    solutions: [
      {
        solutionType: "DELAY",
        legNo: 2003,
        legDelayTime: 75,
        legAdjustedDeparture: "2024-01-27T13:00:00Z",
        legAdjustedArrival: "2024-01-27T14:15:00Z",
        legState: "DLY",
      },
      {
        solutionType: "CANCEL",
        legNo: 1003,
        legDelayTime: 50,
        legAdjustedDeparture: "2024-01-27T11:00:00Z",
        legAdjustedArrival: "2024-01-27T11:00:00Z",
        legState: "CNL",
      },
    ],
  },
  {
    issueId: "0004",
    solutions: [
      {
        solutionType: "DELAY",
        legNo: 2004,
        legDelayTime: 90,
        legAdjustedDeparture: "2024-01-27T13:30:00Z",
        legAdjustedArrival: "2024-01-27T15:00:00Z",
        legState: "DLY",
      },
      {
        solutionType: "CANCEL",
        legNo: 1004,
        legDelayTime: 35,
        legAdjustedDeparture: "2024-01-27T11:30:00Z",
        legAdjustedArrival: "2024-01-27T11:30:00Z",
        legState: "CNL",
      },
    ],
  },
  {
    issueId: "0005",
    solutions: [
      {
        solutionType: "DELAY",
        legNo: 2005,
        legDelayTime: 100,
        legAdjustedDeparture: "2024-01-27T14:00:00Z",
        legAdjustedArrival: "2024-01-27T15:40:00Z",
        legState: "DLY",
      },
      {
        solutionType: "CANCEL",
        legNo: 1005,
        legDelayTime: 25,
        legAdjustedDeparture: "2024-01-27T12:00:00Z",
        legAdjustedArrival: "2024-01-27T12:00:00Z",
        legState: "CNL",
      },
    ],
  },
  {
    issueId: "0006",
    solutions: [
      {
        solutionType: "DELAY",
        legNo: 2006,
        legDelayTime: 110,
        legAdjustedDeparture: "2024-01-27T14:30:00Z",
        legAdjustedArrival: "2024-01-27T16:20:00Z",
        legState: "DLY",
      },
      {
        solutionType: "CANCEL",
        legNo: 1006,
        legDelayTime: 45,
        legAdjustedDeparture: "2024-01-27T12:30:00Z",
        legAdjustedArrival: "2024-01-27T12:30:00Z",
        legState: "CNL",
      },
    ],
  },
  {
    issueId: "0007",
    solutions: [
      {
        solutionType: "DELAY",
        legNo: 2007,
        legDelayTime: 95,
        legAdjustedDeparture: "2024-01-27T15:00:00Z",
        legAdjustedArrival: "2024-01-27T16:35:00Z",
        legState: "DLY",
      },
      {
        solutionType: "CANCEL",
        legNo: 1007,
        legDelayTime: 55,
        legAdjustedDeparture: "2024-01-27T13:00:00Z",
        legAdjustedArrival: "2024-01-27T13:00:00Z",
        legState: "CNL",
      },
    ],
  },
  {
    issueId: "0008",
    solutions: [
      {
        solutionType: "DELAY",
        legNo: 2008,
        legDelayTime: 80,
        legAdjustedDeparture: "2024-01-27T15:30:00Z",
        legAdjustedArrival: "2024-01-27T16:50:00Z",
        legState: "DLY",
      },
      {
        solutionType: "CANCEL",
        legNo: 1008,
        legDelayTime: 65,
        legAdjustedDeparture: "2024-01-27T13:30:00Z",
        legAdjustedArrival: "2024-01-27T13:30:00Z",
        legState: "CNL",
      },
    ],
  },
  {
    issueId: "0009",
    solutions: [
      {
        solutionType: "DELAY",
        legNo: 2009,
        legDelayTime: 105,
        legAdjustedDeparture: "2024-01-27T16:00:00Z",
        legAdjustedArrival: "2024-01-27T17:45:00Z",
        legState: "DLY",
      },
      {
        solutionType: "CANCEL",
        legNo: 1009,
        legDelayTime: 20,
        legAdjustedDeparture: "2024-01-27T14:00:00Z",
        legAdjustedArrival: "2024-01-27T14:00:00Z",
        legState: "CNL",
      },
    ],
  },
  {
    issueId: "0010",
    solutions: [
      {
        solutionType: "DELAY",
        legNo: 2010,
        legDelayTime: 115,
        legAdjustedDeparture: "2024-01-27T16:30:00Z",
        legAdjustedArrival: "2024-01-27T18:25:00Z",
        legState: "DLY",
      },
      {
        solutionType: "CANCEL",
        legNo: 1010,
        legDelayTime: 70,
        legAdjustedDeparture: "2024-01-27T14:30:00Z",
        legAdjustedArrival: "2024-01-27T14:30:00Z",
        legState: "CNL",
      },
    ],
  },
  {
    issueId: "0011",
    solutions: [
      {
        solutionType: "DELAY",
        legNo: 2011,
        legDelayTime: 130,
        legAdjustedDeparture: "2024-01-27T17:00:00Z",
        legAdjustedArrival: "2024-01-27T19:10:00Z",
        legState: "DLY",
      },
      {
        solutionType: "CANCEL",
        legNo: 1011,
        legDelayTime: 85,
        legAdjustedDeparture: "2024-01-27T15:00:00Z",
        legAdjustedArrival: "2024-01-27T15:00:00Z",
        legState: "CNL",
      },
    ],
  },
  {
    issueId: "0012",
    solutions: [
      {
        solutionType: "DELAY",
        legNo: 2012,
        legDelayTime: 140,
        legAdjustedDeparture: "2024-01-27T17:30:00Z",
        legAdjustedArrival: "2024-01-27T19:50:00Z",
        legState: "DLY",
      },
      {
        solutionType: "CANCEL",
        legNo: 1012,
        legDelayTime: 95,
        legAdjustedDeparture: "2024-01-27T15:30:00Z",
        legAdjustedArrival: "2024-01-27T15:30:00Z",
        legState: "CNL",
      },
    ],
  },
];
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Connect to DB
connectDB();

// ✅ API Routes
app.use("/api/masterdata", require("./routes/masterdata.routes"));
app.use("/api/enquiry", require("./routes/enquiry.routes"));
app.use("/api/invoices", require("./routes/invoice.routes"));
app.use("/api/team", require("./routes/team.routes"));
app.use("/api/inventory", require("./routes/inventory.routes"));
app.use("/api/clients", require("./routes/client.routes"));
app.use("/api", require("./routes/upload.routes"));
app.use("/api/employees", require("./routes/employee.routes"));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/employees", require("./routes/employeeSettings.routes"));

app.get("/api/solutions", (req, res) => {
  const { issueId } = req.query;

  if (!issueId) {
    return res.status(400).json({ error: "issueId is required" });
  }

  const issue = issues.find((item) => item.issueId === issueId);

  if (!issue) {
    return res.status(404).json({ error: "Issue not found" });
  }

  res.json(issue.solutions);
});
app.get("/", (req, res) => {
  res.send("API is working 🚀");
});

// ✅ Serve Angular static files
app.use(express.static(path.join(__dirname, "../frontend/dist/olp/browser")));

// ✅ Fallback only for frontend (non-API) routes
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/olp/browser/index.html"));
});

// ✅ Socket.IO Logic
io.on("connection", (socket) => {
  console.log(`🔌 New client connected: ${socket.id}`);

  socket.on("employee-online", async (employeeId) => {
    try {
      onlineEmployees.set(socket.id, employeeId);
      await Employee.findByIdAndUpdate(employeeId, { isOnline: true });
      console.log(`✅ Employee ${employeeId} is online`);

      // Optional: Broadcast to all clients
      socket.broadcast.emit("employee-online", employeeId);
    } catch (err) {
      console.error("❌ Error setting employee online:", err);
    }
  });

  socket.on("employee-offline", async (employeeId) => {
    try {
      await Employee.findByIdAndUpdate(employeeId, { isOnline: false });
      console.log(`🛑 Employee ${employeeId} is offline`);

      // Optional: Broadcast to all clients
      socket.broadcast.emit("employee-offline", employeeId);
    } catch (err) {
      console.error("❌ Error setting employee offline:", err);
    }
  });

  socket.on("disconnect", async () => {
    const employeeId = onlineEmployees.get(socket.id);
    if (employeeId) {
      await Employee.findByIdAndUpdate(employeeId, { isOnline: false });
      socket.broadcast.emit("employee-offline", employeeId);
      onlineEmployees.delete(socket.id);
    }
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
