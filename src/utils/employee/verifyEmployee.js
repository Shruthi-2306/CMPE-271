// function verifyEmployee(req, res, next) {
//     console.log(req.headers["authorization"]);
//     const Header = req.headers["authorization"];
//     console.log("verifyEm-->p",Header)
  
//     if (typeof Header !== "undefined") {
//       // decodedData = jwt.decode(req.headers['authorization']);
//       // if(decodedData.Account)
//       jwt.verify(Header, jwtKey, (err, authData) => {
//         if (err) {
//           console.log("403-->",err)
//           res.sendStatus(403);
//         } else {
//           console.log("CHECK-->",authData._id == req.params.id)
//           if (authData._id == req.params.id) {
//             console.log(authData);
//             if (authData.Account == 3) {
//               next();
//             } else {
//               console.log("auth--->",)
//               res.sendStatus(403);
//             }
//           } else {
//             console.log("forbidden--->",authData,req.params.id)
  
//             res.sendStatus(403);
//           }
//         }
//       });
//     } else {
//       // Forbidden
//       console.log("forbidden")
//       res.sendStatus(403);
//     }
//   }