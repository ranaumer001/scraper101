// const express = require("express");
// const { Server } = require("socket.io");
// const http = require("http");
// const { spawn } = require("child_process");
// const path = require("path");

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server);

// app.use(express.static(path.join(__dirname, "public")));

// app.post("/start-scraping", async (req, res) => {
//   const url = req.query.url;
//   if (!url) {
//     return res.status(400).send("URL is required.");
//   }

//   const scraperProcess = spawn("node", ["script.cjs", url]);

//   scraperProcess.stdout.on("data", (data) => {
//     io.emit("progress", data.toString());
//   });

//   scraperProcess.stderr.on("data", (data) => {
//     io.emit("progress", `Error: ${data.toString()}`);
//   });

//   scraperProcess.on("close", (code) => {
//     io.emit("done", code === 0 ? "Scraping completed successfully!" : "Scraping failed.");
//   });

//   res.status(200).send("Scraping started.");
// });

// const PORT = 3000;
// server.listen(process.env.PORT || PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });

import express from "express";
import { Server } from "socket.io";
import http from "http";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

app.post("/start-scraping", async (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).send("URL is required.");
  }

  // const scraperProcess = spawn("node", ["script.cjs", url]);
  const scraperProcess = spawn("node", [
    "--experimental-top-level-await",
    "script.cjs",
    url,
  ]);

  scraperProcess.stdout.on("data", (data) => {
    io.emit("progress", data.toString());
  });

  scraperProcess.stderr.on("data", (data) => {
    io.emit("progress", `Error: ${data.toString()}`);
  });

  scraperProcess.on("close", (code) => {
    io.emit("done", code === 0 ? "Scraping completed successfully! 🎉" : "Scraping failed. 🙁");
  });

  res.status(200).send("Scraping started.");
});

const PORT = 80;
server.listen(process.env.PORT || PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
