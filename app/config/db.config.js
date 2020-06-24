module.exports = {
  HOST: "localhost",
  USER: "kkim",
  PASSWORD: "1234qwer",
  DB: "mydb",
  dialect: "mariadb",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};



