// Question 1
// 1-
// const fs = require('fs');

// const filePath = "./big.txt";

// const stream = fs.createReadStream(filePath);

// stream.on('data', (chunk) => {
//     console.log("CHUNK:");
//     console.log(chunk.toString());
// });

// stream.on('end', () => {
//     console.log('Finished reading file.');
// });

// stream.on('error', (err) => {
//     console.error('Error reading file:', err);
// });

// 2-

// const fs = require("fs");

// function copyFileUsingStreams(source, destination) {
//   const reader = fs.createReadStream(source);
//   const writer = fs.createWriteStream(destination);

//   reader.pipe(writer);

//   writer.on("finish", () => {
//     console.log("File copied using streams");
//   });

//   reader.on("error", (err) => console.error("Read error:", err));
//   writer.on("error", (err) => console.error("Write error:", err));
// }
// copyFileUsingStreams("./source.txt", "./dest.txt");

//3-

// const fs = require("fs");
// const zlib = require("zlib");
// const { pipeline } = require("stream");

// function compressFile(input, output) {
//   const readStream = fs.createReadStream(input);
//   const gzipStream = zlib.createGzip();
//   const writeStream = fs.createWriteStream(output);

//   pipeline(readStream, gzipStream, writeStream, (err) => {
//     if (err) {
//       console.error("Pipeline failed:", err);
//     } else {
//       console.log("File compressed successfully!");
//     }
//   });
// }

// compressFile("./data.txt", "./data.txt.gz");

// QUESTION2
// 1-

// const http = require("http");
// const fs = require("fs");
// const PORT = 3000;

// function readUsersFile(callback) {
//   fs.readFile("users.json", "utf8", (err, data) => {
//     if (err) return callback(err);
//     callback(null, JSON.parse(data));
//   });
// }

// function writeUsersFile(data, callback) {
//   fs.writeFile("users.json", JSON.stringify(data, null, 2), callback);
// }

// const server = http.createServer((req, res) => {
//   console.log("REQUEST:", req.method, req.url);

//   if (req.method === "POST" && req.url === "/users") {
//     let body = "";

//     req.on("data", chunk => (body += chunk));
//     req.on("end", () => {
//       const newUser = JSON.parse(body);

//       readUsersFile((err, jsonData) => {
//         if (err) {
//           res.writeHead(500);
//           return res.end("Error reading users.json");
//         }

//         const emailExists = jsonData.users.some(
//           user => user.email === newUser.email
//         );

//         if (emailExists) {
//           res.writeHead(400);
//           return res.end("Email already exists");
//         }

//         jsonData.users.push(newUser);

//         writeUsersFile(jsonData, err => {
//           if (err) {
//             res.writeHead(500);
//             return res.end("Error writing users.json");
//           }

//           res.writeHead(201, { "Content-Type": "application/json" });
//           res.end(JSON.stringify({ message: "User added successfully" }));
//         });
//       });
//     });
//   } else {
//     res.writeHead(404);
//     res.end("Route not found");
//   }
// });

// server.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

// 2-

// const http = require('http');
// const fs = require('fs');
// const PORT = 3000;

// const server = http.createServer((req, res) => {
//   console.log("Request URL:", req.url, "Method:", req.method);
//   const putUserMatch = req.url.match(/^\/users\/(\d+)$/);
//   if (req.method === "PUT" && putUserMatch) {
//     const id = parseInt(putUserMatch[1], 10);
//     let body = "";

//     req.on("data", chunk => { body += chunk; });

//     req.on("end", () => {
//       let updatedData;
//       try {
//         updatedData = JSON.parse(body);
//       } catch (err) {
//         res.writeHead(400, { "Content-Type": "application/json" });
//         return res.end(JSON.stringify({ error: "Invalid JSON body" }));
//       }

//       fs.readFile("./users.json", "utf8", (err, data) => {
//         if (err) {
//           res.writeHead(500, { "Content-Type": "application/json" });
//           return res.end(JSON.stringify({ error: "Error reading file" }));
//         }

//         let json;
//         try {
//           json = JSON.parse(data);
//         } catch (err) {
//           res.writeHead(500, { "Content-Type": "application/json" });
//           return res.end(JSON.stringify({ error: "Invalid JSON in users.json" }));
//         }

//         const users = Array.isArray(json.users) ? json.users : json;
//         const user = users.find(u => u.id === id);

//         if (!user) {
//           res.writeHead(404, { "Content-Type": "application/json" });
//           return res.end(JSON.stringify({ error: "User not found" }));
//         }

//         if (updatedData.email) {
//           const emailExists = users.some(u => u.email === updatedData.email && u.id !== id);
//           if (emailExists) {
//             res.writeHead(400, { "Content-Type": "application/json" });
//             return res.end(JSON.stringify({ error: "Email already used by another user" }));
//           }
//         }
//         if (updatedData.name) user.name = updatedData.name;
//         if (updatedData.email) user.email = updatedData.email;
//         if (updatedData.age) user.age = updatedData.age;

//         fs.writeFile("./users.json", JSON.stringify({ users }, null, 2), err => {
//           if (err) {
//             res.writeHead(500, { "Content-Type": "application/json" });
//             return res.end(JSON.stringify({ error: "Error writing file" }));
//           }

//           res.writeHead(200, { "Content-Type": "application/json" });
//           res.end(JSON.stringify({ message: "User updated successfully", user }));
//         });
//       });
//     });

//     return;
//   }
//   res.writeHead(404, { "Content-Type": "application/json" });
//   res.end(JSON.stringify({ error: "Route not found" }));
// });

// server.listen(PORT, () => {
//   console.log("Server running on port", PORT);
// });

// 3-

// const http = require('http');
// const fs = require('fs');
// const PORT = 3000;

// const server = http.createServer((req, res) => {
//   console.log("Request URL:", req.url, "Method:", req.method);
//   const deleteUserMatch = req.url.match(/^\/user\/(\d+)$/);
//   if (req.method === "DELETE" && deleteUserMatch) {
//     const id = parseInt(deleteUserMatch[1], 10);
//     fs.readFile("./users.json", "utf8", (err, data) => {
//       if (err) {
//         res.writeHead(500, { "Content-Type": "application/json" });
//         return res.end(JSON.stringify({ error: "Error reading file" }));
//       }

//       let json;
//       try {
//         json = JSON.parse(data);
//       } catch (err) {
//         res.writeHead(500, { "Content-Type": "application/json" });
//         return res.end(JSON.stringify({ error: "Invalid JSON in users.json" }));
//       }

//       const users = Array.isArray(json.users) ? json.users : json;
//       const userIndex = users.findIndex(u => u.id === id);

//       if (userIndex === -1) {
//         res.writeHead(404, { "Content-Type": "application/json" });
//         return res.end(JSON.stringify({ error: "User not found" }));
//       }

//       const deletedUser = users.splice(userIndex, 1)[0];
//       fs.writeFile("./users.json", JSON.stringify({ users }, null, 2), err => {
//         if (err) {
//           res.writeHead(500, { "Content-Type": "application/json" });
//           return res.end(JSON.stringify({ error: "Error writing file" }));
//         }

//         res.writeHead(200, { "Content-Type": "application/json" });
//         res.end(JSON.stringify({ message: "User deleted successfully", user: deletedUser }));
//       });
//     });

//     return;
//   }

//   res.writeHead(404, { "Content-Type": "application/json" });
//   res.end(JSON.stringify({ error: "Route not found" }));
// });

// server.listen(PORT, () => {
//   console.log("Server running on port", PORT);
// });

// 4-
// const http = require('http');
// const fs = require('fs');
// const PORT = 3000;

// const server = http.createServer((req, res) => {
//   console.log("Request URL:", req.url, "Method:", req.method);

//   if (req.method === "GET" && req.url === "/user") {
//     fs.readFile("./users.json", "utf8", (err, data) => {
//       if (err) {
//         res.writeHead(500, { "Content-Type": "application/json" });
//         return res.end(JSON.stringify({ error: "Error reading file" }));
//       }

//       let json;
//       try {
//         json = JSON.parse(data);
//       } catch (err) {
//         res.writeHead(500, { "Content-Type": "application/json" });
//         return res.end(JSON.stringify({ error: "Invalid JSON in users.json" }));
//       }

//       const users = Array.isArray(json.users) ? json.users : json;

//       res.writeHead(200, { "Content-Type": "application/json" });
//       res.end(JSON.stringify({ users }));
//     });

//     return;
//   }

//   res.writeHead(404, { "Content-Type": "application/json" });
//   res.end(JSON.stringify({ error: "Route not found" }));
// });

// server.listen(PORT, () => {
//   console.log("Server running on port", PORT);
// });

// 5-
const http = require("http");
const fs = require("fs");
const PORT = 3000;

const server = http.createServer((req, res) => {
  console.log("Request URL:", req.url, "Method:", req.method);

  const getUserMatch = req.url.match(/^\/user\/(\d+)$/);
  if (req.method === "GET" && getUserMatch) {
    const id = parseInt(getUserMatch[1], 10);

    fs.readFile("./users.json", "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Error reading file" }));
      }

      let json;
      try {
        json = JSON.parse(data);
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Invalid JSON in users.json" }));
      }

      const users = Array.isArray(json.users) ? json.users : json;
      const user = users.find((u) => u.id === id);

      if (!user) {
        res.writeHead(404, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "User not found" }));
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ user }));
    });

    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Route not found" }));
});

server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
