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
  // var sortDirection = req.query.sortDirection;
  if (req.query.completed) {
    if(req.query.completed ==='completed') {
      Project.find(function(err,array) {
         res.render('index', {items:filterComplete(array)})
      })
    } else {
      Project.find(function(err,array) {
        res.render('index',{items:filterUncomplete(array)} )
      })
    }
  } else {
    if (req.query.sort) {
      var sortObject = {};
      sortObject[req.query.sort] = 1;
      if(parseInt(req.query.sortOrder) === -1) {
        sortObject[req.query.sort] = -1
      }
      Project.find().sort(sortObject).exec(function(err, array) {
        if(req.query.totalCont) {
          res.render('index', {items:sumCont(array)})
        } else {
          res.render('index',{items:array})
        }// YOUR CODE HERE
      });
    }
    else {
      Project.find(function(err,array){
        if(req.query.totalCont) {
          res.render('index', {items:sumCont(array)})
        } else {
          res.render('index',{items:array})
        }
      })
    }
  }
});
function filterComplete(data) {

  return data.filter(function(a) {
    var atotal = 0;
    // console.log(a)
    a.contributions.forEach(function(item) {
      atotal+=item.amount;
      // console.log(atotal)
    });
    // console.log(atotal)
    return (atotal/a.goal) >= 1
  })
}
function filterUncomplete(data) {
  return data.filter(function(a) {
    var atotal = 0;
    a.contributions.forEach(function(item) {
      atotal+=item.amount;
    });
    return (atotal/a.goal) < 1
  })
}

function sumCont(data) {
  return data.sort(function(a,b) {
      var atotal = 0;
      a.contributions.forEach(function(item) {
        atotal+=item.amount;
      })
      var btotal = 0;
      b.contributions.forEach(function(item) {
        btotal+=item.amount;
      })
      return btotal - atotal;
    })
}

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
  console.log(req.body.category)
  console.log(req.body.title)
  var newObj = new Project ({
    title: req.body.title,
    goal: req.body.goal,
    description: req.body.description,
    start: new Date(req.body.start),
    end: new Date(req.body.end),
    category: req.body.category
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
      var total = 0;
      var count = 0;
      result.contributions.forEach(function(contribution) {
        count++;
        total += contribution.amount;
      })
      var percent = total/result.goal
      result.total = total;
      result.percent= (percent * 100).toFixed(2);
      result.count = count;
      console.log(result)
      res.render('project',result)
    }
  })
  // YOUR CODE HERE
});

// Part 4: Contribute to a project
// Implement the GET /project/:projectid endpoint
router.post('/project/:projectid', function(req, res) {
  var newcont = {name: req.body.contributionName, amount: req.body.contribution}
  // console.log(req.body)
  var projectid = req.params.projectid;
  Project.findById(projectid, function(error, result){
    if(error) {
      res.status(404).send("THERE WAS AN ERROR IDK WHY")
    } else {
      if(result.contributions) {
        result.contributions.push(newcont)
      } else {
        result.contributions = [].push(newcont)
      }
      console.log(result)
      result.save(function(error){
        if(error) {
          res.status(404).send("THERE WAS ANOTHER ERROR IDK WHY")
        } else {
          res.redirect(`/project/${projectid}`)
        }
      })
    }
  })
  // YOUR CODE HERE
});

router.get('/project/:projectid/edit', function(req, res) {
  var projectid = req.params.projectid;
  Project.findById(projectid, function(error, result) {
    if(error) {
      res.status(404).send(error)
    } else {
      res.render('editProject',result)
    }
  })
})

router.post('/project/:projectid/edit', function(req,res) {
  Project.findByIdAndUpdate(req.params.projectid, {
  title: req.body.title,
  goal: req.body.goal,
  description: req.body.description,
  start: new Date(req.body.start),
  end: new Date(req.body.end),
  category: req.body.category
  // YOUR CODE HERE
  }, function(err) {
    if(err) {
      res.status(400).send("YOU FUCKED UP")
    } else {
      res.redirect('/project/' + req.params.projectid)
    }
  // YOUR CODE HERE
} );
})

// Part 6: Edit project
// Create the GET /project/:projectid/edit endpoint
// Create the POST /project/:projectid/edit endpoint

module.exports = router;
