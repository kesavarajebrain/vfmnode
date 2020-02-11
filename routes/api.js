const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const mongoose = require('mongoose')
const db = "mongodb+srv://vaanisai:12stdmark789@cluster0-qh2xr.mongodb.net/test?retryWrites=true&w=majority";
var http = require("http");
var multer = require('multer');
var sftpStorage = require('multer-sftp');

var serverpath = 'https://vaanisaistorage.000webhostapp.com/rjaudios/'
var storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, '../../uploads');
  },
  filename: function (request, file, callback) {
    callback(null, file.originalname)
  }
});

// var storage = sftpStorage({
//   sftp: {
//     host: 'files.000webhost.com',
//     port: 21,
//     username: 'vaanisaistorage',
//     password: 'Ji#993te',
//     promptForPass: false,
//     remote: "/",
//     readyTimeout: 99999,
//     timeout: 120000,
//     method: 'POST',
//     headers: {
//       "Accept": "application/json"
//     }
//   },
//   destination: function (req, file, cb) {
//     cb(null, 'rjaudios/') // designation folder in host
//   },
//   filename: function (req, file, cb) {
//     // file name settings
//     cb(null, file.originalname)
//   }
// })


const Feedback = require('../models/feedback');
const Job = require('../models/job');
const Donor = require('../models/donor');
const Program = require('../models/program');
const Movie = require('../models/movie');
const Rj = require('../models/rj');
const AudioRj = require('../models/audiorj');

var email = require('emailjs/email');


mongoose.connect(db, err => {
  if (err) {
    console.log('Error !' + err);
  } else {
    console.log('connected to mongoDB');
  }
});

router.post('/sendfeedback', (req, res) => {
  const token = req.headers["x-access-token"] && req.headers["x-access-token"] == 'vToken eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ2YWFuaXNhaUZNIiwibmFtZSI6InZhYW5pc2FpRk0iLCJpYXQiOjQ4NDB9.7ZwPhdjEJXBXXgyBTuoCxHPmkXPmqHSJIxDcz0Cj74g';
  if (token) {
    let userData = req.body;
    let feedback = new Feedback(userData);
    feedback.save((error, feedback) => {
      if (error) {
        console.log(error);
      } else {
        res.status(200).send({ status: true, msg: "It's a additional recognition for us...!", feedback });
      }
    })
  } else {
    res.status(400).send({
      status: 400,
      Warning: " VAANISAI CONFIDENTIAL DATA - Unauthorized User Cant't Accept... Listen Vaanisai FM !"
    });
  }
});

router.post('/savedonor', (req, res) => {
  const token = req.headers["x-access-token"] && req.headers["x-access-token"] == 'vToken eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ2YWFuaXNhaUZNIiwibmFtZSI6InZhYW5pc2FpRk0iLCJpYXQiOjQ4NDB9.7ZwPhdjEJXBXXgyBTuoCxHPmkXPmqHSJIxDcz0Cj74g';
  if (token) {
    let donordata = req.body;
    let donor = new Donor(donordata);
    donor.save((error, donor) => {
      if (error) {
        console.log(error);
      } else {
        res.status(200).send({ status: true, msg: "Thank you for joining with us...!", donor });
      }
    })
  } else {
    res.status(400).send({
      status: 400,
      Warning: " VAANISAI CONFIDENTIAL DATA - Unauthorized User Cant't Accept... Listen Vaanisai FM !"
    });
  }

});

router.post('/updatefeedback', function (req, res) {
  const token = req.headers["x-access-token"] && req.headers["x-access-token"] == 'vToken eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ2YWFuaXNhaUZNIiwibmFtZSI6InZhYW5pc2FpRk0iLCJpYXQiOjQ4NDB9.7ZwPhdjEJXBXXgyBTuoCxHPmkXPmqHSJIxDcz0Cj74g';
  if (token) {
    Feedback.findByIdAndUpdate(
      req.body._id,
      {
        $set: {
          username: req.body.username,
          userimage: req.body.userimage,
          userid: req.body.userid,
          useroccupation: req.body.useroccupation,
          userfeedback: req.body.userfeedback,
          createdAt: req.body.createdAt,
        }
      },
      {
        new: true
      },
      function (err, updateFeed) {
        if (err) {
          res.send('Error updating user');
        } else {
          res.status(200).send({ status: true, msg: "It's a additional recognize for us!", updateFeed });
        }
      }
    );
  } else {
    res.status(400).send({
      status: 400,
      Warning: " VAANISAI CONFIDENTIAL DATA - Unauthorized User Cant't Accept... Listen Vaanisai FM !"
    });
  }

});


router.post('/sendotp', (req, res) => {
  const token = req.headers["x-access-token"] && req.headers["x-access-token"] == 'vToken eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ2YWFuaXNhaUZNIiwibmFtZSI6InZhYW5pc2FpRk0iLCJpYXQiOjQ4NDB9.7ZwPhdjEJXBXXgyBTuoCxHPmkXPmqHSJIxDcz0Cj74g';
  if (token) {
    let contactData = req.body;
    Donor.find(
      {
        phonenumber: contactData.mobilenumber
      },
      async (err, result) => {
        if (result.length > 0) {
          res.status(200).send({ status: true, msg: 'Number already exist', Number: contactData.mobilenumber });

        } else {

          var options = {
            "method": "POST",
            "hostname": "control.msg91.com",
            "port": null,
            "path": "/api/sendotp.php?authkey=294225ARSylNln5d7e39e9&sender=VAANFM&otp_expiry=1&otp=" + contactData.otp + "&mobile=" + contactData.mobilenumber,
            "headers": {}
          };
          // /api/sendotp.php?authkey=267433AasRmmBdVC5c8a1c2b&otp_expiry=1&otp=" + req.body.phone + "&mobile=" + req.body.phone **** "path": "/api/sendotp.php?otp_length=4&authkey=267433AasRmmBdVC5c8a1c2b&message=Your verification code is&sender=ABCDEF&mobile=919677424386&otp=1234&otp_expiry=1440",

          var req = http.request(options, function (res) {
            var chunks = [];

            res.on("data", function (chunk) {
              chunks.push(chunk);
            });

            res.on("end", function () {
              var body = Buffer.concat(chunks);
            });
          });
          res.status(200).send({ status: true, msg: 'Otp sent', result: contactData });
          req.end();

        }
      }
    )
  } else {
    res.status(400).send({
      status: 400,
      Warning: " VAANISAI CONFIDENTIAL DATA - Unauthorized User Cant't Accept... Listen Vaanisai FM !"
    });
  }
});

router.get('/getfeedbacks', (req, res) => {
  const token = req.headers["x-access-token"] && req.headers["x-access-token"] == 'vToken eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ2YWFuaXNhaUZNIiwibmFtZSI6InZhYW5pc2FpRk0iLCJpYXQiOjQ4NDB9.7ZwPhdjEJXBXXgyBTuoCxHPmkXPmqHSJIxDcz0Cj74g';
  if (token) {
    Feedback.find(function (err, result) {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
        console.log(result)
      }
    }).limit(5).sort({ createdAt: -1 });
  } else {
    res.status(400).send({
      status: 400,
      Warning: " VAANISAI CONFIDENTIAL DATA - Unauthorized User Cant't Accept... Listen Vaanisai FM !"
    });
  }

});

router.post('/myfeedback', (req, res) => {
  const token = req.headers["x-access-token"] && req.headers["x-access-token"] == 'vToken eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ2YWFuaXNhaUZNIiwibmFtZSI6InZhYW5pc2FpRk0iLCJpYXQiOjQ4NDB9.7ZwPhdjEJXBXXgyBTuoCxHPmkXPmqHSJIxDcz0Cj74g';
  if (token) {
    Feedback.findById(req.body.userid, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
  } else {
    res.status(400).send({
      status: 400,
      Warning: " VAANISAI CONFIDENTIAL DATA - Unauthorized User Cant't Accept... Listen Vaanisai FM !"
    });
  }
});

router.get('/getallfeedbacks', (req, res) => {
  const token = req.headers["x-access-token"] && req.headers["x-access-token"] == 'vToken eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ2YWFuaXNhaUZNIiwibmFtZSI6InZhYW5pc2FpRk0iLCJpYXQiOjQ4NDB9.7ZwPhdjEJXBXXgyBTuoCxHPmkXPmqHSJIxDcz0Cj74g';
  if (token) {
    Feedback.find({ active: 'yes' }, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }).sort({ createdAt: -1 });
  } else {
    res.status(400).send({
      status: 400,
      Warning: " VAANISAI CONFIDENTIAL DATA - Unauthorized User Cant't Accept... Listen Vaanisai FM !"
    });
  }
});

router.get('/getlast', (req, res) => {
  const token = req.headers["x-access-token"] && req.headers["x-access-token"] == 'vToken eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ2YWFuaXNhaUZNIiwibmFtZSI6InZhYW5pc2FpRk0iLCJpYXQiOjQ4NDB9.7ZwPhdjEJXBXXgyBTuoCxHPmkXPmqHSJIxDcz0Cj74g';
  if (token) {
    Feedback.find(function (err, result) {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }).limit(1).sort({ createdAt: -1 });
  } else {
    res.status(400).send({
      status: 400,
      Warning: " VAANISAI CONFIDENTIAL DATA - Unauthorized User Cant't Accept... Listen Vaanisai FM !"
    });
  }
});

router.get('/getjobs', (req, res) => {
  const token = req.headers["x-access-token"] && req.headers["x-access-token"] == 'vToken eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ2YWFuaXNhaUZNIiwibmFtZSI6InZhYW5pc2FpRk0iLCJpYXQiOjQ4NDB9.7ZwPhdjEJXBXXgyBTuoCxHPmkXPmqHSJIxDcz0Cj74g';
  if (token) {
    Job.find(function (err, result) {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
  } else {
    res.status(400).send({
      status: 400,
      Warning: " VAANISAI CONFIDENTIAL DATA - Unauthorized User Cant't Accept... Listen Vaanisai FM !"
    });
  }
});

router.post('/getonefeedback', (req, res) => {
  const token = req.headers["x-access-token"] && req.headers["x-access-token"] == 'vToken eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ2YWFuaXNhaUZNIiwibmFtZSI6InZhYW5pc2FpRk0iLCJpYXQiOjQ4NDB9.7ZwPhdjEJXBXXgyBTuoCxHPmkXPmqHSJIxDcz0Cj74g';
  if (token) {
    Feedback.findById(req.body._id, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
  } else {
    res.status(400).send({
      status: 400,
      Warning: " VAANISAI CONFIDENTIAL DATA - Unauthorized User Cant't Accept... Listen Vaanisai FM !"
    });
  }
});

router.get('/allprograms', (req, res) => {
  const token = req.headers["x-access-token"] && req.headers["x-access-token"] == 'vToken eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ2YWFuaXNhaUZNIiwibmFtZSI6InZhYW5pc2FpRk0iLCJpYXQiOjQ4NDB9.7ZwPhdjEJXBXXgyBTuoCxHPmkXPmqHSJIxDcz0Cj74g';
  if (token) {
    var promise = Program.aggregate([

      {
        $group: {
          _id: "$prgCollection",
          programs: { $push: "$$ROOT" }
        }
    
      },
      { "$sort": { uploaddate: -1 } }

    ]);
    promise
      .then(data => {
        res.status(200).send(data);
      })
      .catch(err => {
        res.status(500).send(err);
      });
  } else {
    res.status(400).send({
      status: 400,
      Warning: " VAANISAI CONFIDENTIAL DATA - Unauthorized User Cant't Accept... Listen Vaanisai FM !"
    });
  }
});

router.get('/alllikeprograms', (req, res) => {
  const token = req.headers["x-access-token"] && req.headers["x-access-token"] == 'vToken eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ2YWFuaXNhaUZNIiwibmFtZSI6InZhYW5pc2FpRk0iLCJpYXQiOjQ4NDB9.7ZwPhdjEJXBXXgyBTuoCxHPmkXPmqHSJIxDcz0Cj74g';
  if (token) {
    Program.find(function (err, result) {
      if (err) {
        console.log(err);
      } else {
        res.status(200).send({ status: true, msg: "like programs fetched!", result });
      }
    });
  } else {
    res.status(400).send({
      status: 400,
      Warning: " VAANISAI CONFIDENTIAL DATA - Unauthorized User Cant't Accept... Listen Vaanisai FM !"
    });
  }
});

router.post('/getsinglemovie', (req, res) => {
  const token = req.headers["x-access-token"] && req.headers["x-access-token"] == 'vToken eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ2YWFuaXNhaUZNIiwibmFtZSI6InZhYW5pc2FpRk0iLCJpYXQiOjQ4NDB9.7ZwPhdjEJXBXXgyBTuoCxHPmkXPmqHSJIxDcz0Cj74g';
  if (token) {
    Movie.findById(req.body._id, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
  } else {
    res.status(400).send({
      status: 400,
      Warning: " VAANISAI CONFIDENTIAL DATA - Unauthorized User Cant't Accept... Listen Vaanisai FM !"
    });
  }
});

router.post('/findprogram', (req, res) => {
  const token = req.headers["x-access-token"] && req.headers["x-access-token"] == 'vToken eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ2YWFuaXNhaUZNIiwibmFtZSI6InZhYW5pc2FpRk0iLCJpYXQiOjQ4NDB9.7ZwPhdjEJXBXXgyBTuoCxHPmkXPmqHSJIxDcz0Cj74g';
  if (token) {
    Program.findById(req.body._id, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
  } else {
    res.status(400).send({
      status: 400,
      Warning: " VAANISAI CONFIDENTIAL DATA - Unauthorized User Cant't Accept... Listen Vaanisai FM !"
    });
  }
});

router.post('/thanksletter', (req, res) => {
  const token = req.headers["x-access-token"] && req.headers["x-access-token"] == 'vToken eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ2YWFuaXNhaUZNIiwibmFtZSI6InZhYW5pc2FpRk0iLCJpYXQiOjQ4NDB9.7ZwPhdjEJXBXXgyBTuoCxHPmkXPmqHSJIxDcz0Cj74g';
  if (token) {
    var server = email.server.connect({
      user: 'listenvaanisaifm@gmail.com',
      password: '12stdmark789',
      host: 'smtp.gmail.com',
      ssl: true
    });
    server.send(
      {
        text: 'You have signed up',
        from: 'listenvaanisaifm@gmail.com',
        to: req.body.email,
        subject: 'Thanks For Joining With Vaanisai Community',
        attachment: [
          {
            data:
              "<html><p style='text-align:center;color: #15793B;font-size: 22px;'>Letter of Thanks - Vaanisai Community</p></html>" +
              "<html><p style='margin-top: 3%;color:black;font-size:19px'>Dear <b>Kesavaraj,</b></p></html>" +
              "<html><p style='text-indent: 3%; font-size: 18px;'>We sincerely say thanks to you for join with our vaanisai community. We appreciate your helping mind with hearty thanks. We are eager to connect with you and help others. We will get back to you soon if need.</p> </html>" +
              "<html><p style='margin-top: 1%;color:#15793B; font-weight: bold;text-align: center;font-size: 18px;'>உங்களது  கையை கடவுளை குவிப்பதை விட மதிப்புமிக்கது... உங்களது கையை பிறர்க்கு உதவ நீட்டுவது.</p></html>" +
              "<html><p style='margin-top: 4%;font-size: 15px;color: #15793B'>Thanks and Regards,</p></html>" +
              "<html><p style='font-size: 15px;color: #15793B'>Vaanisai Team.</p></html>" +
              "<html><p style='font-size: 15px;color: #15793B'>Stay connected with <img src='https://www.gstatic.com/images/branding/product/2x/google_fonts_ios_60dp.png' height='20px' width='20px'></p></html>",
            alternative: true
          }
          //  {path:"pathtofile.zip", type:"application/zip", name:"renamed.zip"}
        ]
      },
      function (err, message) {
        if (err) console.log(err);
        else res.json({ success: true, msg: 'sent', message });
      }
    );
  } else {
    res.status(400).send({
      status: 400,
      Warning: " VAANISAI CONFIDENTIAL DATA - Unauthorized User Cant't Accept... Listen Vaanisai FM !"
    });
  }
});

router.post('/addrj', (req, res) => {
  const token = req.headers["x-access-token"] && req.headers["x-access-token"] == 'vToken eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ2YWFuaXNhaUZNIiwibmFtZSI6InZhYW5pc2FpRk0iLCJpYXQiOjQ4NDB9.7ZwPhdjEJXBXXgyBTuoCxHPmkXPmqHSJIxDcz0Cj74g';
  if (token) {
    let rjData = req.body;
    Rj.find(
      {
        rjNumber: rjData.rjNumber
      },
      async (err, result) => {
        if (result.length > 0) {
          res.status(200).send({ status: 'false', msg: 'Number already exist', Number: rjData.rjNumber });
        } else {
          let rj = new Rj(rjData);
          rj.save((error, rjData) => {
            if (error) {
              console.log(error);
            } else {
              res.status(200).send({ status: true, msg: "RJ Added Successfully!", rjData });
            }
          })
        }
      }
    )
  } else {
    res.status(400).send({
      status: 400,
      Warning: " VAANISAI CONFIDENTIAL DATA - Unauthorized User Cant't Accept... Listen Vaanisai FM !"
    });
  }
});

var upload = multer({ storage: storage });
router.post('/uploadaudio', upload.single('uploads[]'), (req, res) => {
  let rjAudioData = req.body;
  let audiorj = new AudioRj(rjAudioData);
  audiorj.save((error, rjAudioData) => {
    if (error) {
      console.log(error);
    } else {
      res.status(200).send({ status: true, msg: "Program Uploaded Successfully!", rjAudioData });
    }
  })
});


router.post('/rjlogin', (req, res) => {
  let rjData = req.body
  Rj.findOne({ rjNumber: rjData.rjlogNumber }, (error, user) => {
    if (error) {
      console.log(error)
    } else {
      if (!user) {
        res.status(200).send({ status: 'phonenumber', msg: 'Invalid Phone Number' })
      } else {
        if (user.rjPassword !== rjData.rjlogPassword) {
          res.status(200).send({ status: true, status: 'password', msg: 'Invalid Password' })
        } else {
          res.status(200).send({ user })
        }
      }
    }
  });
});

// ##################### --->>>>> admin API's <<<<<-------------##################

router.post('/addmovie', (req, res) => {
  const token = req.headers["x-access-token"] && req.headers["x-access-token"] == 'vToken eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ2YWFuaXNhaUZNIiwibmFtZSI6InZhYW5pc2FpRk0iLCJpYXQiOjQ4NDB9.7ZwPhdjEJXBXXgyBTuoCxHPmkXPmqHSJIxDcz0Cj74g';
  if (token) {
    let movieData = req.body;
    let movie = new Movie(movieData);
    movie.save((error, program) => {
      if (error) {
        console.log(error);
      } else {
        res.status(200).send({ status: true, msg: "Movie Added Successfully!", movie });
      }
    })
  } else {
    res.status(400).send({
      status: 400,
      Warning: " VAANISAI CONFIDENTIAL DATA - Unauthorized User Cant't Accept... Listen Vaanisai FM !"
    });
  }
});

router.post('/uploadprogram', (req, res) => {
  const token = req.headers["x-access-token"] && req.headers["x-access-token"] == 'vToken eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ2YWFuaXNhaUZNIiwibmFtZSI6InZhYW5pc2FpRk0iLCJpYXQiOjQ4NDB9.7ZwPhdjEJXBXXgyBTuoCxHPmkXPmqHSJIxDcz0Cj74g';
  if (token) {
    let programdata = req.body;
    let program = new Program(programdata);
    program.save((error, program) => {
      if (error) {
        console.log(error);
      } else {
        res.status(200).send({ status: true, msg: "Program Added Successfully!", program });
      }
    })
  } else {
    res.status(400).send({
      status: 400,
      Warning: " VAANISAI CONFIDENTIAL DATA - Unauthorized User Cant't Accept... Listen Vaanisai FM !"
    });
  }
});

router.get('/getmovies', (req, res) => {
  const token = req.headers["x-access-token"] && req.headers["x-access-token"] == 'vToken eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ2YWFuaXNhaUZNIiwibmFtZSI6InZhYW5pc2FpRk0iLCJpYXQiOjQ4NDB9.7ZwPhdjEJXBXXgyBTuoCxHPmkXPmqHSJIxDcz0Cj74g';
  if (token) {
    Movie.find(function (err, result) {
      if (err) {
        console.log(err);
      } else {
        res.status(200).send({ status: true, msg: "Movies fetched!", result });
      }
    });
  } else {
    res.status(400).send({
      status: 400,
      Warning: " VAANISAI CONFIDENTIAL DATA - Unauthorized User Cant't Accept... Listen Vaanisai FM !"
    });
  }
});

router.post('/delMovie', (req, res) => {
  const token = req.headers["x-access-token"] && req.headers["x-access-token"] == 'vToken eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ2YWFuaXNhaUZNIiwibmFtZSI6InZhYW5pc2FpRk0iLCJpYXQiOjQ4NDB9.7ZwPhdjEJXBXXgyBTuoCxHPmkXPmqHSJIxDcz0Cj74g';
  if (token) {
    Movie.findByIdAndRemove(req.body._id, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        res.status(200).send({ status: true, msg: "Movie deleted done!", result });
      }
    });
  } else {
    res.status(400).send({
      status: 400,
      Warning: " VAANISAI CONFIDENTIAL DATA - Unauthorized User Cant't Accept... Listen Vaanisai FM !"
    });
  }
});

router.get('/donorcount', (req, res) => {
  const token = req.headers["x-access-token"] && req.headers["x-access-token"] == 'vToken eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ2YWFuaXNhaUZNIiwibmFtZSI6InZhYW5pc2FpRk0iLCJpYXQiOjQ4NDB9.7ZwPhdjEJXBXXgyBTuoCxHPmkXPmqHSJIxDcz0Cj74g';
  if (token) {
    Donor.countDocuments(function (err, result) {
      if (err) {
        console.log(err);
      } else {
        res.status(200).send({ status: true, msg: "donors fetched!", result });
      }
    });
  } else {
    res.status(400).send({
      status: 400,
      Warning: " VAANISAI CONFIDENTIAL DATA - Unauthorized User Cant't Accept... Listen Vaanisai FM !"
    });
  }
});

router.get('/rjcount', (req, res) => {
  const token = req.headers["x-access-token"] && req.headers["x-access-token"] == 'vToken eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ2YWFuaXNhaUZNIiwibmFtZSI6InZhYW5pc2FpRk0iLCJpYXQiOjQ4NDB9.7ZwPhdjEJXBXXgyBTuoCxHPmkXPmqHSJIxDcz0Cj74g';
  if (token) {
    Rj.countDocuments(function (err, result) {
      if (err) {
        console.log(err);
      } else {
        res.status(200).send({ status: true, msg: "rj's fetched!", result });
      }
    });
  } else {
    res.status(400).send({
      status: 400,
      Warning: " VAANISAI CONFIDENTIAL DATA - Unauthorized User Cant't Accept... Listen Vaanisai FM !"
    });
  }
});

router.get('/feedbackcount', (req, res) => {
  const token = req.headers["x-access-token"] && req.headers["x-access-token"] == 'vToken eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ2YWFuaXNhaUZNIiwibmFtZSI6InZhYW5pc2FpRk0iLCJpYXQiOjQ4NDB9.7ZwPhdjEJXBXXgyBTuoCxHPmkXPmqHSJIxDcz0Cj74g';
  if (token) {
    Feedback.countDocuments(function (err, result) {
      if (err) {
        console.log(err);
      } else {
        res.status(200).send({ status: true, msg: "feedbacks fetched!", result });
      }
    });
  } else {
    res.status(400).send({
      status: 400,
      Warning: " VAANISAI CONFIDENTIAL DATA - Unauthorized User Cant't Accept... Listen Vaanisai FM !"
    });
  }
});

router.get('/rjlist', (req, res) => {
  const token = req.headers["x-access-token"] && req.headers["x-access-token"] == 'vToken eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ2YWFuaXNhaUZNIiwibmFtZSI6InZhYW5pc2FpRk0iLCJpYXQiOjQ4NDB9.7ZwPhdjEJXBXXgyBTuoCxHPmkXPmqHSJIxDcz0Cj74g';
  if (token) {
    Rj.find(function (err, result) {
      if (err) {
        console.log(err);
      } else {
        res.status(200).send({ status: true, msg: "rj list fetched!", result });
      }
    });
    // .sort({datefield: -1})
  } else {
    res.status(400).send({
      status: 400,
      Warning: " VAANISAI CONFIDENTIAL DATA - Unauthorized User Cant't Accept... Listen Vaanisai FM !"
    });
  }
});

router.get('/getcommunities', (req, res) => {
  const token = req.headers["x-access-token"] && req.headers["x-access-token"] == 'vToken eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ2YWFuaXNhaUZNIiwibmFtZSI6InZhYW5pc2FpRk0iLCJpYXQiOjQ4NDB9.7ZwPhdjEJXBXXgyBTuoCxHPmkXPmqHSJIxDcz0Cj74g';
  if (token) {
    Donor.find(function (err, result) {
      if (err) {
        console.log(err);
      } else {
        res.status(200).send({ status: true, msg: "community list fetched!", result });
      }
    });
    // .sort({datefield: -1})
  } else {
    res.status(400).send({
      status: 400,
      Warning: " VAANISAI CONFIDENTIAL DATA - Unauthorized User Cant't Accept... Listen Vaanisai FM !"
    });
  }
});

router.get('/programlist', (req, res) => {
  const token = req.headers["x-access-token"] && req.headers["x-access-token"] == 'vToken eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ2YWFuaXNhaUZNIiwibmFtZSI6InZhYW5pc2FpRk0iLCJpYXQiOjQ4NDB9.7ZwPhdjEJXBXXgyBTuoCxHPmkXPmqHSJIxDcz0Cj74g';
  if (token) {
    Program.find(function (err, result) {
      if (err) {
        console.log(err);
      } else {
        res.status(200).send({ status: true, msg: "program list fetched!", result });
      }
    }).sort({ uploaddate: -1 });
  } else {
    res.status(400).send({
      status: 400,
      Warning: " VAANISAI CONFIDENTIAL DATA - Unauthorized User Cant't Accept... Listen Vaanisai FM !"
    });
  }
});

router.post('/updateprogram', function (req, res) {
  const token = req.headers["x-access-token"] && req.headers["x-access-token"] == 'vToken eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ2YWFuaXNhaUZNIiwibmFtZSI6InZhYW5pc2FpRk0iLCJpYXQiOjQ4NDB9.7ZwPhdjEJXBXXgyBTuoCxHPmkXPmqHSJIxDcz0Cj74g';
  if (token) {
    Program.findByIdAndUpdate(
      req.body._id,
      {
        $set: {
          prgImgUrl: req.body.prgImgUrl,
          prgCollection: req.body.prgCollection,
          prgTitle: req.body.prgTitle,
          prgAudioUrl: req.body.prgAudioUrl,
          prgMarqueeMsg: req.body.prgMarqueeMsg,
          uploaddate: req.body.uploaddate,
          modifiedAt: req.body.modifiedAt,
          active: req.body.active
        }
      },
      {
        new: true
      },
      function (err, updateFeed) {
        if (err) {
          res.send('Error updating user');
        } else {
          res.status(200).send({ status: true, msg: "Program updated done!", updateFeed });
        }
      }
    );
  } else {
    res.status(400).send({
      status: 400,
      Warning: " VAANISAI CONFIDENTIAL DATA - Unauthorized User Cant't Accept... Listen Vaanisai FM !"
    });
  }
});

router.post('/deletefeedback', function (req, res) {
  const token = req.headers["x-access-token"] && req.headers["x-access-token"] == 'vToken eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ2YWFuaXNhaUZNIiwibmFtZSI6InZhYW5pc2FpRk0iLCJpYXQiOjQ4NDB9.7ZwPhdjEJXBXXgyBTuoCxHPmkXPmqHSJIxDcz0Cj74g';
  if (token) {
    Feedback.findByIdAndUpdate(
      req.body._id,
      {
        $set: {
          active: 'no'
        }
      },
      {
        new: true
      },
      function (err, updateFeed) {
        if (err) {
          res.send('Error updating user');
        } else {
          res.status(200).send({ status: true, msg: "Feedback deleted done!", updateFeed });
        }
      }
    );
  } else {
    res.status(400).send({
      status: 400,
      Warning: " VAANISAI CONFIDENTIAL DATA - Unauthorized User Cant't Accept... Listen Vaanisai FM !"
    });
  }
});

router.get('/allfeedbacks', (req, res) => {
  const token = req.headers["x-access-token"] && req.headers["x-access-token"] == 'vToken eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ2YWFuaXNhaUZNIiwibmFtZSI6InZhYW5pc2FpRk0iLCJpYXQiOjQ4NDB9.7ZwPhdjEJXBXXgyBTuoCxHPmkXPmqHSJIxDcz0Cj74g';
  if (token) {
    Feedback.find(function (err, result) {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }).sort({ createdAt: -1 });
  } else {
    res.status(400).send({
      status: 400,
      Warning: " VAANISAI CONFIDENTIAL DATA - Unauthorized User Cant't Accept... Listen Vaanisai FM !"
    });
  }
});


router.post('/moviebyid', (req, res) => {
  const token = req.headers["x-access-token"] && req.headers["x-access-token"] == 'vToken eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ2YWFuaXNhaUZNIiwibmFtZSI6InZhYW5pc2FpRk0iLCJpYXQiOjQ4NDB9.7ZwPhdjEJXBXXgyBTuoCxHPmkXPmqHSJIxDcz0Cj74g';
  if (token) {
    Movie.findById(req.body._id, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
  } else {
    res.status(400).send({
      status: 400,
      Warning: " VAANISAI CONFIDENTIAL DATA - Unauthorized User Cant't Accept... Listen Vaanisai FM !"
    });
  }
});

router.post('/rjbyid', (req, res) => {
  const token = req.headers["x-access-token"] && req.headers["x-access-token"] == 'vToken eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ2YWFuaXNhaUZNIiwibmFtZSI6InZhYW5pc2FpRk0iLCJpYXQiOjQ4NDB9.7ZwPhdjEJXBXXgyBTuoCxHPmkXPmqHSJIxDcz0Cj74g';
  if (token) {
    Rj.findById(req.body._id, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
  } else {
    res.status(400).send({
      status: 400,
      Warning: " VAANISAI CONFIDENTIAL DATA - Unauthorized User Cant't Accept... Listen Vaanisai FM !"
    });
  }
});


module.exports = router;

// Access key ID - AKIAUUGNIMPP6OJJL6OU

// Secret access key - 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