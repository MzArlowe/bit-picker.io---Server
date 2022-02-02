const router = require("express").Router();
const { UniqueConstraintError } = require("sequelize/lib/errors");
const { UserModel } = require("../models").models;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const models = require("../models");

router.post("/register", async (req, res) => {

    let { role, email, password } = req.body.user;
    try {
      const User = await UserModel.create({
        role: role,
        email,
        password: bcrypt.hashSync(password, 13),
  
      });
  
      let token = jwt.sign({ id: User.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });
  
      res.status(201).json({
        message: "User successfully registered",
        user: User,
        sessionToken: token,
      });
    } catch (err) {
        // console.log(err);
      if (err instanceof UniqueConstraintError) {
        res.status(409).json({
          message: "Email already in use",
        });
      } else {
        res.status(500).json({
          message: "Failed to register user",
          
        });
      }
    }
  });

  router.get('/userinfo', async (req, res) => {
    try {
      await UserModel.findOne({
        include: [
          {
            model: models.BuildModel,
            include: [
              {
                model: models.PartsModel
              }
            ]
          }
        ]
    })
  } catch (err) {
    console.log(err);
  }
  });

  router.post("/login", async (req, res) => {
    let { email, password } = req.body.user;
  
    try {
      const loginUser = await UserModel.findOne({
        where: {
          email: email,
        },
      });
      if (loginUser) {
          let passwordComparison = await bcrypt.compare(password, loginUser.password);
  
          if (passwordComparison){
  
        let token = jwt.sign({ id: loginUser.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });
        res.status(200).json({
          user: loginUser,
          message: "User successfully logged in!",
          sessionToken: token,
        });
      } else {
        res.status(401).json({
          message: "Incorrect email or password",
        });
      }
    } else {
        res.status(401).json({
            message: "Incorrect email or password",
        });
    } 
  } catch (error) {
      res.status(500).json({
        message: "Failed to log user in",
      });
    }
    }
  
  );
  
  module.exports = router;