var express = require("express");
var  mongoose = require("mongoose");
// var autoIncrement = require("mongoose-auto-increment"),
// var Joi = require("joi"),
//var app = express();
var jwt = require("jsonwebtoken");
require('dotenv').config();
const router=express.Router();
//import verifyEmployee from '../../utils/employee/verifyEmployee'
router.get("/",function(req,res){
  res.send("Family info details")
})

router.post("/family-info/:id", verifyEmployee, (req, res) => {
    Joi.validate(req.body, FamilyInfoValidation, (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).send(err.details[0].message);
      } else {
        Employee.findById(req.params.id, function (err, employee) {
          if (err) {
            console.log(err);
            res.send("err");
          } else {
            let newFamilyInfo;
  
            newFamilyInfo = {
              Name: req.body.Name,
              Relationship: req.body.Relationship,
              DOB: req.body.DOB,
              Occupation: req.body.Occupation
            };
  
            FamilyInfo.create(newFamilyInfo, function (err, familyInfo) {
              if (err) {
                console.log(err);
                res.send("error");
              } else {
                employee.familyInfo.push(familyInfo);
                employee.save(function (err, data) {
                  if (err) {
                    console.log(err);
                    res.send("err");
                  } else {
                    console.log(data);
                    res.send(familyInfo);
                  }
                });
                console.log("new familyInfo Saved");
              }
            });
            console.log(req.body);
          }
        });
      }
    });
  });
  
  router.put("/family-info/:id", verifyEmployee, (req, res) => {
    
        let newFamilyInfo;
  
        newFamilyInfo = {
          Name: req.body.Name,
          Relationship: req.body.Relationship,
          DOB: req.body.DOB,
          Occupation: req.body.Occupation
        };
  
        FamilyInfo.findByIdAndUpdate(req.params.id, newFamilyInfo, function (
          err,
          familyInfo
        ) {
          if (err) {
            res.send("error");
          } else {
            res.send(newFamilyInfo);
          }
        });
      
      console.log("put");
      console.log(req.body);
   
  });
  
  router.delete("/api/family-info/:id/:id2", verifyEmployee, (req, res) => {
    Employee.findById({ _id: req.params.id }, function (err, employee) {
      if (err) {
        res.send("error");
        console.log(err);
      } else {
        FamilyInfo.findByIdAndRemove({ _id: req.params.id2 }, function (
          err,
          familyInfo
        ) {
          if (!err) {
            console.log("FamilyInfo deleted");
            Employee.update(
              { _id: req.params.id },
              { $pull: { familyInfo: req.params.id2 } },
              function (err, numberAffected) {
                console.log(numberAffected);
                res.send(familyInfo);
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