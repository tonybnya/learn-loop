const app = require("./app");

// define the PORT for the server
const PORT = process.env.PORT || 3000;

// start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
