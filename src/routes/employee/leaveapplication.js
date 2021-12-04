var express = require("express");
var  mongoose = require("mongoose");
// var autoIncrement = require("mongoose-auto-increment"),
// var Joi = require("joi"),
//var app = express();
var jwt = require("jsonwebtoken");
require('dotenv').config();
const router=express.Router();
import verifyEmployee from '../../utils/employee/verifyEmployee'
router.get("/",function(req,res){
    res.send("Leave Experience details")
})

router.get("/leave-application-emp/:id", verifyEmployee, (req, res) => {
    console.log(req.params.id);
  
    Employee.findById(req.params.id)
    
      .populate({
        path: "leaveApplication"
        
      })
     
      .select("FirstName LastName MiddleName")
      .exec(function (err, employee) {
        // console.log(filteredCompany);
        if (err) {
          console.log(err);
          res.send("error");
        } else {
          res.send(employee);
        }
      });
  });
  
  router.post("/leave-application-emp/:id", verifyEmployee, (req, res) => {
   
        Employee.findById(req.params.id, function (err, employee) {
          if (err) {
            console.log(err);
            res.send("err");
          } else {
            let newLeaveApplication;
            newLeaveApplication = {
              Leavetype: req.body.Leavetype,
              FromDate: req.body.FromDate,
              ToDate: req.body.ToDate,
              Reasonforleave: req.body.Reasonforleave,
              Status: req.body.Status,
              employee: req.params.id
            };
  
            LeaveApplication.create(newLeaveApplication, function (
              err,
              leaveApplication
            ) {
              if (err) {
                console.log(err);
                res.send("error");
              } else {
                employee.leaveApplication.push(leaveApplication);
                employee.save(function (err, data) {
                  if (err) {
                    console.log(err);
                    res.send("err");
                  } else {
                    console.log(data);
                    res.send(leaveApplication);
                  }
                });
                console.log("new leaveApplication Saved");
              }
            });
            console.log(req.body);
          }
        });
     
  });
  
  router.put("/leave-application-emp/:id",  (req, res) => {
    
        let newLeaveApplication;
  
        newLeaveApplication = {
          Leavetype: req.body.Leavetype,
          FromDate: req.body.FromDate,
          ToDate: req.body.ToDate,
          Reasonforleave: req.body.Reasonforleave,
          Status: req.body.Status,
          employee: req.params.id
        };
  
        LeaveApplication.findByIdAndUpdate(
          req.params.id,
          newLeaveApplication,
          function (err, leaveApplication) {
            if (err) {
              res.send("error");
            } else {
              res.send(newLeaveApplication);
            }
          }
        );
      
      console.log("put");
      console.log(req.body);
    
  });
  
  router.delete(
    "/leave-application-emp/:id/:id2",
    verifyEmployee,
    (req, res) => {
      Employee.findById({ _id: req.params.id }, function (err, employee) {
        if (err) {
          res.send("error");
          console.log(err);
        } else {
          LeaveApplication.findByIdAndRemove({ _id: req.params.id2 }, function (
            err,
            leaveApplication
          ) {
            if (!err) {
              console.log("LeaveApplication deleted");
              Employee.update(
                { _id: req.params.id },
                { $pull: { leaveApplication: req.params.id2 } },
                function (err, numberAffected) {
                  console.log(numberAffected);
                  res.send(leaveApplication);
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
    }
  );
module.exports=router  