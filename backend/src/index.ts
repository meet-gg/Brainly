import { app } from "./app";
import { dbConnect } from "./utils/db";

const PORT = process.env.PORT || 3000;

dbConnect().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((error) => {
  console.error("Failed to connect to the database. Server not started.", error);
});
