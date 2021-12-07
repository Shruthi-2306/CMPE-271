var express = require("express");
var  mongoose = require("mongoose");
// var autoIncrement = require("mongoose-auto-increment"),
// var Joi = require("joi"),
//var app = express();
var jwt = require("jsonwebtoken");
require('dotenv').config();
const router=express.Router();


router.get("/",function(req,res){
    res.send("Admin details")
})


app.get("/api/admin/portal", verifyAdmin, (req, res) => {
    Portal.find()
      .populate({ path: "projects" })
      .exec(function (err, portalData) {
        if (err) {
          res.send("err");
          console.log(err);
        }
        res.send(portalData);
      });
  });
  
  app.post("/api/admin/portal", verifyAdmin, (req, res) => {
    Joi.validate(req.body, PortalValidation, (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).send(err.details[0].message);
      } else {
        let newPortal;
        newPortal = {
          PortalName: req.body.PortalName,
          Status: req.body.Status
        };
  
        Portal.create(newPortal, function (err, portalData) {
          if (err) {
            console.log(err);
            res.send("error");
          } else {
            res.send(portalData);
            console.log("new Portal Saved");
          }
        });
        console.log(req.body);
      }
    });
  });
  
  app.put("/api/admin/portal/:id", verifyAdmin, (req, res) => {
    Joi.validate(req.body, PortalValidation, (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).send(err.details[0].message);
      } else {
        let updatePortal;
        updatePortal = {
          PortalName: req.body.PortalName,
          Status: req.body.Status
        };
        Portal.findByIdAndUpdate(req.body._id, updatePortal, function (
          err,
          Portal
        ) {
          if (err) {
            res.send("error");
          } else {
            res.send(updatePortal);
          }
        });
      }
  
      console.log("put");
      console.log(req.body);
    });
  });
  
  app.delete("/api/admin/portal/:id", verifyAdmin, (req, res) => {
    Portal.findByIdAndRemove({ _id: req.params.id }, function (err, portal) {
      if (!err) {
        console.log("portal deleted");
        res.send(portal);
        Project.deleteMany({ portals: { _id: portal._id } }, function (err) {
          if (err) {
            res.send("error");
            console.log(err);
          }
        });
        console.log("new Portal Saved");
      } else {
        console.log("error");
        res.send("err");
      }
    });
    console.log("delete");
    console.log(req.params.id);
  });

  
// middleware

function verifyAdmin(req, res, next) {
    console.log(req.headers["authorization"]);
    const Header = req.headers["authorization"];
  
    if (typeof Header !== "undefined") {
      // decodedData = jwt.decode(req.headers['authorization']);
      // if(decodedData.Account)
      jwt.verify(Header, jwtKey, (err, authData) => {
        if (err) {
          res.sendStatus(403);
        } else {
          console.log(authData);
          if (authData.Account == 1) {
            next();
          } else {
            res.sendStatus(403);
          }
        }
      });
    } else {
      // Forbidden
      res.sendStatus(403);
    }
  }