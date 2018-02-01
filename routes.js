"use strict";

// Routes, with inline controllers for each route.
var express = require('express');
var router = express.Router();
var Project = require('./models').Project;
var strftime = require('strftime');

// Example endpoint
router.get('/create-test-project', function(req, res) {
  var project = new Project({
    title: 'I am a test project'
  });
  project.save(function(err) {
    if (err) {
      res.status(500).json(err);
    } else {
      res.send('Success: created a Project object in MongoDb');
    }
  });
});

// Part 1: View all projects
// Implement the GET / endpoint.
router.get('/', function(req, res) {
  Project.find(function(err, array) {
    res.render('index', {items: array});
  });
  // YOUR CODE HERE
});

// Part 2: Create project
// Implement the GET /new endpoint
router.get('/new', function(req, res) {
  // if(!req.body.title )
  res.render('new')
    // YOUR CODE HERE
});

// Part 2: Create project
// Implement the POST /new endpoint
router.post('/new', function(req, res) {
  var newObj = new Project ({
    title: req.body.title,
    goal: req.body.goal,
    description: req.body.description,
    start: new Date(req.body.start),
    end: new Date(req.body.end)
  });
  // console.log(req.body.title)
  // console.log(req.body.goal)
  // console.log(req.body.start)
  // console.log(req.body.end)
  newObj.save(function(error,result) {
    if(error) {
      res.status(400).render('new', req.body)
    } else {
      res.redirect('/')
    }
  })
  // if(req.body.title && req.body.goal && req.body.start && req.body.end) {
  //   res.render('new', newObj)
  //   newObj.save(function(error,result) {
  //     if(error) {
  //       res.status(400).send("There was an error with the creation of the projectc")
  //     }
  //   })
  // } else {
  //   res.status(404).render('new',newObj)
  // }
  // YOUR CODE HERE
});

// Part 3: View single project
// Implement the GET /project/:projectid endpoint
router.get('/project/:projectid', function(req, res) {
  var projectid = req.params.projectid
  Project.findById(projectid, function(error, result) {
    if(error) {
      res.status(404).send(error)
    } else {
      res.render('project',{
        id: projectid,
        title: result.title,
        goal: result.goal,
        description: result.description,
        start: result.start,
        end: result.end
      })
    }
  })
  // YOUR CODE HERE
});

// Part 4: Contribute to a project
// Implement the GET /project/:projectid endpoint
router.post('/project/:projectid', function(req, res) {
  var projectid = req.params.projectid;
  Project.findById(projectid, function(error, result){
    if(error) {
      res.status(404).send("THERE WAS AN ERROR IDK WHY")
    } else {
      result.contribution.push({
        name: req.body.name,
        amount: req.body.contribution
      })
      result.save(function(){
        if(error) {
          res.status(404).send("THERE WAS ANOTHER ERROR IDK WHY")
        } else {
          console.log("THANK YOU FOR YOUR CONTRIBUTION")
          
        }
      })
      })
    }
  })
  // YOUR CODE HERE
});

// Part 6: Edit project
// Create the GET /project/:projectid/edit endpoint
// Create the POST /project/:projectid/edit endpoint

module.exports = router;
