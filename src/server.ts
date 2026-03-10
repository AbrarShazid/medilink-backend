import app from "./app";

const PORT = process.env.PORT || 5000;

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
