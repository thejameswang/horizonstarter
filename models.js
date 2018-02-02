"use strict";

// Project model
var mongoose = require('mongoose');

var Project = mongoose.model('Project', {
  title: {
    type: String,
    required: true,
  },
  goal: {
    type:Number,
    required: true,
  },
  description: {
    type:String,
    required:false,
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required:true,
  },
  contributions: [{
    name: String,
    amount: Number
  }],
  category: {
    type: String,
    enum: ['Famous Muppet Frogs','Current Black Presidents','The Pen Is Mightier', 'Famous Mothers', 'Drummers Named Ringo', '1-Letter Words', "Months That Start With 'Feb'", 'How Many Fingers Am I Holding Up', 'Potent Potables'],
    required: true
  }
});
/*goal: Type: Number, required
description: Type: String
start: Type: Date, required
end: Type: Date, required*/
module.exports = {
  Project: Project
}
