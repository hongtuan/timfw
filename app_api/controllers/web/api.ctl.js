// const apiDao = require('../../dao/api.dao.js');
const _ = require('lodash');
const mongoose = require('mongoose');
const Api = mongoose.model('Api');
// const commDao = require('../../dao/common.document.dao');
const controllerHelper = require('../controllerHelper');

module.exports.create = function(req, res) {
  const doc = req.body.doc;
  controllerHelper.createDocument(req, res, Api, doc);
  /*
  commDao.createDocument(Api, doc, function (err, newDoc) {
    if (err) {
      console.log(err);
      res.status(406).json(err);
      return;
    }
    res.status(201).json(newDoc);
  });//*/
};

module.exports.showList = function(req, res) {
  controllerHelper.getDocuments(req, res, Api);
  /*
  const queryOption = controllerHelper.buildQueryOption(req, res);
  console.log('queryOption=',queryOption);
  commDao.getDocuments(Api,queryOption,function (err,rows) {
    if (err) {
      console.log(err);
      res.status(400).json(err);
    }
    res.status(200).json(rows);
  });//*/
};

module.exports.updateById = function(req, res) {
  const id = req.params.id;
  const updateDoc = req.body.doc;
  controllerHelper.updateDocumentById(req,res,Api,id,updateDoc,true);
  /*
  commDao.updateDocumentById(Api, id, updateDoc, function (err, newDoc) {
    if (err) {
      console.log(err);
      res.status(406).json('update failed:'+err);
    }
    res.status(200).json(newDoc);
  },true);//*/
};

module.exports.deleteById = function(req, res) {
  const id = req.params.id;
  controllerHelper.removeDocumentById(req,res,Api,id);
  /*
  commDao.removeDocumentById(Api, id, function (err, removeSuccess) {
    if (err) {
      console.log(err);
      //res.status(404).json(err);
      res.status(500).json('api remove failed.'+err);
    }
    res.status(200).json({success: removeSuccess});
  });//*/
};

module.exports.increaseTestTimesById = function(req, res) {
  const id = req.params.id;
  const updateDoc = {$inc: {testTimes: 1}};
  controllerHelper.updateDocumentById(req, res, Api,id,updateDoc,true);
  /*
  commDao.updateDocumentById(Api, id, updateDoc, function (err, newDoc) {
    if (err) {
      console.log(err);
      res.status(406).json('update failed:'+err);
    }
    res.status(200).json(newDoc);
  },true);//*/
};
