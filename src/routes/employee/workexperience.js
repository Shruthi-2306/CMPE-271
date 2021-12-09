var express = require("express");
var  mongoose = require("mongoose");
// var autoIncrement = require("mongoose-auto-increment"),
// var Joi = require("joi"),
//var app = express();
var jwt = require("jsonwebtoken");
require('dotenv').config();
const router=express.Router();


router.get("/",function(req,res){
    res.send("Work Experience details")
})

router.post("/api/work-experience/:id", verifyEmployee, (req, res) => {
   
        Employee.findById(req.params.id, function (err, employee) {
          if (err) {
            console.log(err);
            res.send("err");
          } else {
            let newWorkExperience;
  
            newWorkExperience = {
              CompanyName: req.body.CompanyName,
              Designation: req.body.Designation,
              FromDate: req.body.FromDate,
              ToDate: req.body.ToDate
            };
  
            WorkExperience.create(newWorkExperience, function (
              err,
              workExperience
            ) {
              if (err) {
                console.log(err);
                res.send("error");
              } else {
                employee.workExperience.push(workExperience);
                employee.save(function (err, data) {
                  if (err) {
                    console.log(err);
                    res.send("err");
                  } else {
                    console.log(data);
                    res.send(workExperience);
                  }
                });
                console.log("new WorkExperience Saved");
              }
            });
            console.log(req.body);
          }
        });
     
  });
  
  router.put("/api/work-experience/:id", (req, res) => {
    console.log("Work edit")
   
        let newWorkExperience;
  
        newWorkExperience = {
          CompanyName: req.body.CompanyName,
          Designation: req.body.Designation,
          FromDate: req.body.FromDate,
          ToDate: req.body.ToDate
        };
        console.log("newWork",newWorkExperience)
  
        WorkExperience.findByIdAndUpdate(
          req.params.id,
          newWorkExperience,
          function (err, workExperience) {
            if (err) {
              res.send("error");
            } else {
              console.log("work experience edit")
              res.send(newWorkExperience);
            }
          }
        );
      
      console.log("put");
      console.log(req.body);
   
  });
  
  router.delete("/api/Work-experience/:id/:id2", verifyEmployee, (req, res) => {
    Employee.findById({ _id: req.params.id }, function (err, employee) {
      if (err) {
        res.send("error");
        console.log(err);
      } else {
        WorkExperience.findByIdAndRemove({ _id: req.params.id2 }, function (
          err,
          workExperience
        ) {
          if (!err) {
            console.log("WorkExperience deleted");
            Employee.update(
              { _id: req.params.id },
              { $pull: { workExperience: req.params.id2 } },
              function (err, numberAffected) {
                console.log(numberAffected);
                res.send(workExperience);
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