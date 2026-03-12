import app from "./app";
import { envVariables } from "./app/config/env";


const PORT=envVariables.PORT
const main = () => {
  try {
    app.listen(PORT, () => {
      console.log(`The running port is`, PORT);
    });
  } catch (error) {
    console.log("Something Went Wrong!", error);
  }
};

main();
