const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const { spawn } = require("child_process");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files (index.html)
app.use(express.static(path.join(__dirname, "public")));

app.post("/start-scraping", (req, res) => {
  const url = req.query.url; // Get the URL from the query parameter
  if (!url) {
    return res.status(400).send("URL is required.");
  }

  // Spawn the Puppeteer script
  const scraperProcess = spawn("node", ["script.cjs", url]);

  // Listen for progress updates from the scraper
  scraperProcess.stdout.on("data", (data) => {
    io.emit("progress", data.toString());
  });

  scraperProcess.stderr.on("data", (data) => {
    io.emit("progress", `Error: ${data.toString()}`);
  });

  scraperProcess.on("close", (code) => {
    io.emit("done", code === 0 ? "Scraping completed successfully!" : "Scraping failed.");
  });

  res.status(200).send("Scraping started.");
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
