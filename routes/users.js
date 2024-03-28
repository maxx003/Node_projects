const express = require("express");
const router = express.Router();
const fs = require("fs").promises;

const filePath = "./database.json"; //Link to our mock database

//Middlewares
router.use(express.json()); // parse JSON
router.use(express.urlencoded({ extended: true })); //handle form data
router.use(async (req, res, next) => {
  try {
    const data = await readData();
    res.locals.userData = JSON.stringify(data);
  } catch (error) {
    res.status(500).send("Internal Server Error", error);
  }
  next();
});

//high-level function to show database data
async function readData() {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    res.status(500).send("Internal Server Error", error);
  }
}

//high-level function to write to the database file
async function writeData(data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    res.status(500).send("Internal Server Error", error);
  }
}

//Create a new user
router.post("/users", async (req, res) => {
  try {
    const data = await readData();
    const lastUser = data.users[data.users.length - 1];
    const lastUserInt = parseInt(lastUser.id);
    const nextId = lastUser ? lastUserInt + 1 : 1;

    const { username, first_name, email } = req.body;

    const newUser = {
      id: nextId,
      username: username,
      first_name: first_name,
      email: email,
    };

    data.users.push(newUser);

    await writeData(data);

    res.send("User added successfully");
  } catch (error) {
    res.status(500).send("Internal Server Error", error);
  }
});

router.post("/users/:id/update", async (req, res) => {
  try {
    const data = await readData();
    const user = data.users.find((user) => user.id == req.params.id);

    if (user) {
      user.username = req.body.new_username || user.username;
      user.first_name = req.body.new_first_name || user.first_name;
      user.email = req.body.new_email || user.email;

      await writeData(data);

      res
        .send(200)
        .send(
          "User successfully updated.  Updated database:" +
            JSON.stringify(data.users)
        );
    } else {
      res.status(404).send("User is not found.");
    }
  } catch (error) {
    res.status(500).send("Internal Server Error", error);
  }
});

//Home page route with user data
router.get("/", (req, res) => {
  const data = res.locals.userData;
  res.render("home", { data });
});

module.exports = router;
