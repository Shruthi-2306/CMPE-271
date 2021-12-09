var express = require("express");
var  mongoose = require("mongoose");
// var autoIncrement = require("mongoose-auto-increment"),
// var Joi = require("joi"),
//var app = express();
var jwt = require("jsonwebtoken");
require('dotenv').config();
const router=express.Router();
router.get("/",function(req,res){
    res.send("Education details")
})


router.post("/education/:id", verifyEmployee, (req, res) => {
   
        Employee.findById(req.params.id, function (err, employee) {
          if (err) {
            console.log(err);
            res.send("err");
          } else {
            let newEducation;
  
            newEducation = {
              SchoolUniversity: req.body.SchoolUniversity,
              Degree: req.body.Degree,
              Grade: req.body.Grade,
              PassingOfYear: req.body.PassingOfYear
            };
  
            Education.create(newEducation, function (err, education) {
              if (err) {
                console.log(err);
                res.send("error");
              } else {
                employee.education.push(education);
                employee.save(function (err, data) {
                  if (err) {
                    console.log(err);
                    res.send("err");
                  } else {
                    console.log(data);
                    res.send(education);
                  }
                });
                console.log("new Education Saved");
              }
            });
            console.log(req.body);
         
      }
    });
  });
  
  router.put("/education/:id", (req, res) => {
   
        let newEducation;
  
        newEducation = {
          SchoolUniversity: req.body.SchoolUniversity,
          Degree: req.body.Degree,
          Grade: req.body.Grade,
          PassingOfYear: req.body.PassingOfYear
        };
  
        Education.findByIdAndUpdate(req.params.id, newEducation, function (
          err,
          education
        ) {
          if (err) {
            res.send("error");
          } else {
            res.send(newEducation);
          }
        });
      
      console.log("put");
      console.log(req.body);
   
  });
  
  router.delete("/education/:id/:id2", verifyEmployee, (req, res) => {
    Employee.findById({ _id: req.params.id }, function (err, employee) {
      if (err) {
        res.send("error");
        console.log(err);
      } else {
        Education.findByIdAndRemove({ _id: req.params.id2 }, function (
          err,
          education
        ) {
          if (!err) {
            console.log("education deleted");
            Employee.update(
              { _id: req.params.id },
              { $pull: { education: req.params.id2 } },
              function (err, numberAffected) {
                console.log(numberAffected);
                res.send(education);
              }
            );
          } else {
            console.log(err);
            res.send("error");
          }
        });
        console.log("delete");
        console.log(req.params.id);
      }
    });
  });
  function verifyEmployee(req, res, next) {
    console.log(req.headers["authorization"]);
    const Header = req.headers["authorization"];
    console.log("verifyEm-->p",Header)
  
    if (typeof Header !== "undefined") {
      // decodedData = jwt.decode(req.headers['authorization']);
      // if(decodedData.Account)
      jwt.verify(Header, jwtKey, (err, authData) => {
        if (err) {
          console.log("403-->",err)
          res.sendStatus(403);
        } else {
          console.log("CHECK-->",authData._id == req.params.id)
          if (authData._id == req.params.id) {
            console.log(authData);
            if (authData.Account == 3) {
              next();
            } else {
              console.log("auth--->",)
              res.sendStatus(403);
            }
          } else {
            console.log("forbidden--->",authData,req.params.id)
  
            res.sendStatus(403);
          }
        }
      });
    } else {
      // Forbidden
      console.log("forbidden")
      res.sendStatus(403);
    }
  }

  module.exports=router; 
  