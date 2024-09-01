const express = require("express");
const fs = require("fs");
// const path = require("path");
const https = require("https");

const app = express();
const port = 3000;

if (!fs.existsSync("data.json")) {
    fs.writeFileSync(__dirname + "/data.json", "[]");
}
if (!fs.existsSync("20k.json")) {
    fs.writeFileSync(__dirname + "/20k.json", '{ "t": "", "l": false }');
}

app.get("/20k", (req, res) => {
    const userAgent = req.headers["user-agent"];
    if (userAgent && userAgent.toLowerCase().includes("discord")) {
        res.sendFile("./1x1.png", { root: __dirname });
    } else {
        const text = req.query.t;
        const key = req.query.k;
        if (key !== "lsdhflsjkfhdljksdh") {
            res.send("-1");
            return;
        }
        console.log(text);

        if (
            text &&
            JSON.parse(fs.readFileSync(__dirname + "/20k.json")).l == false
        ) {
            let data = { t: text, l: true /* false */ };

            try {
                fs.writeFileSync(__dirname + "/20k.json", JSON.stringify(data));
                res.send("1");
            } catch (error) {
                res.send("-1");
            }
        } else {
            res.send(JSON.parse(fs.readFileSync(__dirname + "/20k.json")).t);
        }
    }
});

app.get("/v", (req, res) => {
    // fetch https://games.roblox.com/v1/games?universeIds=5170175577 and return data.data.data[0].visits
    const userAgent = req.headers["user-agent"];
    if (userAgent && userAgent.toLowerCase().includes("discord")) {
        res.sendFile("./1x1.png", { root: __dirname });
    } else {
        const response = fetch(
            "https://games.roblox.com/v1/games?universeIds=5170175577"
        )
            .then((response) => response.json())
            .then((data) => {
                res.send(`${data.data[0].visits}`);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                res.send("-1");
            });
    }
});

app.get("/a", (req, res) => {
    const userAgent = req.headers["user-agent"];

    if (userAgent && userAgent.toLowerCase().includes("discord")) {
        res.sendFile("./1x1.png", { root: __dirname });
    } else {
        const n = req.query.n;

        if (n) {
            let data = [];
            try {
                const fileData = fs.readFileSync(__dirname + "/data.json");
                data = JSON.parse(fileData);
            } catch (error) {
                console.error("Error reading JSON file:", error);
            }

            const existingName = data.find((item) => item.n === n);
            if (!existingName) {
                data.push({ n, l: new Date().getTime(), p: 1 });
            } else {
                existingName.l = new Date().getTime();
                existingName.p += 1;
            }

            try {
                fs.writeFileSync(
                    __dirname + "/data.json",
                    JSON.stringify(data)
                );
            } catch (error) {
                console.error("Error writing JSON file:", error);
            }
        }

        res.send("1");
    }
});

app.get("/r", (req, res) => {
    const userAgent = req.headers["user-agent"];

    if (userAgent && userAgent.toLowerCase().includes("discord")) {
        res.sendFile("./1x1.png", { root: __dirname });
    } else {
        const n = req.query.n;

        if (n) {
            let data = [];
            try {
                const fileData = fs.readFileSync(__dirname + "/data.json");
                data = JSON.parse(fileData);
            } catch (error) {
                res.send("-1");
                console.error("Error reading JSON file:", error);
            }

            const index = data.findIndex((item) => item.n === n);
            if (index !== -1) {
                data.splice(index, 1);

                try {
                    fs.writeFileSync(
                        __dirname + "/data.json",
                        JSON.stringify(data)
                    );
                } catch (error) {
                    res.send("-1");
                    console.error("Error writing JSON file:", error);
                }
            }
        }

        res.send("1");
    }
});

app.get("/g", (req, res) => {
    const userAgent = req.headers["user-agent"];

    if (userAgent && userAgent.toLowerCase().includes("discord")) {
        res.sendFile("./1x1.png", { root: __dirname });
    } else {
        let data = [];
        try {
            const fileData = fs.readFileSync(__dirname + "/data.json");
            data = JSON.parse(fileData);
        } catch (error) {
            res.send("-1");
            console.error("Error reading JSON file:", error);
        }

        res.send(data);
    }
});

app.get("/", (req, res) => {
    const userAgent = req.headers["user-agent"];
    const sort = req.query.sort;
    const order = req.query.order;

    if (userAgent && userAgent.toLowerCase().includes("discord")) {
        res.sendFile("./1x1.png", { root: __dirname });
    } else {
        let data = [];
        try {
            const fileData = fs.readFileSync(__dirname + "/data.json");
            data = JSON.parse(fileData);
        } catch (error) {
            res.send("-1");
            console.error("Error reading JSON file:", error);
        }

        if (sort && order) {
            data.sort((a, b) => {
                let comparison = 0;
                switch (sort) {
                    case "name":
                        comparison = a.n.localeCompare(b.n);
                        break;
                    case "lastPlayed":
                        comparison =
                            new Date(a.l).getTime() - new Date(b.l).getTime();
                        break;
                    case "visits":
                        comparison = (a.p || 0) - (b.p || 0);
                        break;
                }
                return order === "desc" ? comparison * -1 : comparison;
            });
        }

        const totalVisits = data.reduce((sum, item) => sum + (item.p || 0), 0);
        const averageVisits = data.length > 0 ? totalVisits / data.length : 0;

        let html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Natural Disaster Survival: Reimagined</title><style>* {font-family: arial, sans-serif;}table {font-family: arial, sans-serif;border-collapse: collapse;width: 100%;}td, th {border: 1px solid #dddddd;text-align: left;padding: 8px;}tr:nth-child(even) {background-color: #dddddd;}</style></head><body><h2>Natural Disaster Survival: Reimagined</h2><p>Length: ${
            data.length
        } | Average Visits: ${averageVisits.toFixed(
            2
        )} | Recorded Visits: ${data.reduce(
            (sum, item) => sum + (item.p || 0),
            0
        )}</p><a href="advanced"><button style="font-size:larger"><b>Try Advanced mode</b></button><br><br></a><table><tr><th><a href="/?sort=name&order=${
            sort === "name" && order === "asc" ? "desc" : "asc"
        }">Name</a></th><th><a href="/?sort=lastPlayed&order=${
            sort === "lastPlayed" && order === "asc" ? "desc" : "asc"
        }">Last Played</a></th><th><a href="/?sort=visits&order=${
            sort === "visits" && order === "asc" ? "desc" : "asc"
        }">Visits</a></th></tr>`;
        data.forEach((item) => {
            const name = item.n;
            const lastPing = item.l
                ? new Date(Number(item.l)).toUTCString()
                : "No data yet";
            const pingCount = item.p || 0;
            html += `<tr><td>${name}</td><td>${lastPing}</td><td>${pingCount}</td></tr>`;
        });
        html += "</table></body></html>";

        res.set("Cache-Control", "no-store");
        res.send(html);
    }
});

app.get("/advanced", (req, res) => {
    const userAgent = req.headers["user-agent"];
    const sort = req.query.sort;
    const order = req.query.order;

    if (userAgent && userAgent.toLowerCase().includes("discord")) {
        res.sendFile("./1x1.png", { root: __dirname });
    } else {
        res.sendFile("./advanced.html", { root: __dirname });
    }
});

// discord webhook proxy
app.get("/w", async (req, res) => {
    const id = req.query.i;
    const token = req.query.t;
    const body = atob(req.query.b);
    const url = `https://discord.com/api/webhooks/${id}/${token}`;

    const maxRetries = 5;
    let attempt = 0;
    let success = false;
    let response;

    while (attempt < maxRetries && !success) {
        try {
            response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: body,
            });

            if (response.ok) {
                success = true;
            } else {
                throw new Error(
                    `Request failed with status ${response.status}`
                );
            }
        } catch (error) {
            console.error(`Attempt ${attempt + 1} failed: ${error.message}`);
            attempt++;
            if (attempt < maxRetries) {
                await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second before retrying
            }
        }
    }

    if (success) {
        res.send(await response.json());
    } else {
        res.status(500).send("Failed to send request after multiple attempts.");
    }
});

app.get("/join", (req, res) => {
    res.redirect(
        "https://www.roblox.com/games/15012649215/Natural-Disaster-Survival-Reimagined"
    );
});

app.get("/game", (req, res) => {
    res.redirect(
        "https://www.roblox.com/games/15012649215/Natural-Disaster-Survival-Reimagined"
    );
});

app.get("/go", (req, res) => {
    res.redirect(
        "https://www.roblox.com/games/15012649215/Natural-Disaster-Survival-Reimagined"
    );
});

app.get("/go/ndsr", (req, res) => {
    res.redirect(
        "https://www.roblox.com/games/15012649215/Natural-Disaster-Survival-Reimagined"
    );
});

const options = {
    key: fs.readFileSync(__dirname + "/key.pem"),
    cert: fs.readFileSync(__dirname + "/cert.crt"),
};

https.createServer(options, app).listen(port, () => {
    console.log(`App listening at https://localhost:${port}`);
});
