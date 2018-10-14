/**
 * api类实体
 **/
const mongoose = require('mongoose');

//api
const ApiSchema = new mongoose.Schema({
  url: String,
  name: String,
  introduction: String,//功能介绍
  testTimes: { type: Number, default: 0},
  auth: String,
  status: {
    type: String,
    default: '1'
  },
  testResult: {
    type: String,
    default: 'failed',
    enum: ['failed', 'passed']
  },
  testParam: {},
  reqType: {
    type: String,
    default: 'get',
    enum: ['get', 'post', 'put', 'delete']
  },
  reqParam: {},
  comment:[{
    content: String,
    commentTime:{
      type: Date,
      default: Date.now
    }
  }],
  createdOn: {
    type: Date,
    default: Date.now
  },
  updatedOn: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Api', ApiSchema);//表名Api
