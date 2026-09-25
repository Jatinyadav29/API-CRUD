import app from "./src/app/app.js";
import { connectToDB } from "./src/config/db.js";
import config from "./src/config/config.js";

const port = config.PORT;

await connectToDB();

app.listen(port, () => {
  console.log("Server running");
});
