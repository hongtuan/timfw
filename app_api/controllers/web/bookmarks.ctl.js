// var bookmarkDao = require('../../dao/bookmarks.dao.js');
const mongoose = require('mongoose');
const Bookmark = mongoose.model('Bookmark');
const commDao = require('../../dao/common.document.dao');
const controllerHelper = require('../controllerHelper');

/**
 * 新建备品包
 * @param req
 * @param res
 */
module.exports.create = function (req, res) {
  const doc = req.body.doc;
  commDao.createDocument(Bookmark, doc, function (err, newDoc) {
    if (err) {
      console.log(err);
      res.status(406).json(err);
      return;
    }
    res.status(201).json(newDoc);
  });
};

/**
 * 备品包列表
 * @param req
 * @param res
 */
module.exports.showList = function (req, res) {
  const queryOption = controllerHelper.buildQueryOption(req, res);
  queryOption.sort = 'containerIndex';
  commDao.getDocuments(Bookmark, queryOption, function (err, rows) {
    if (err) {
      console.log(err);
      res.status(400).json(err);
    }
    res.status(200).json(rows);
  });
};

module.exports.updateOne = function (req, res) {
  const id = req.params.id;
  const updateDoc = req.body.doc;
  commDao.updateDocumentById(Bookmark, id, updateDoc, function (err, newDoc) {
    if (err) {
      console.log(err);
      res.status(406).json('update failed:' + err);
    }
    res.status(200).json(newDoc);
  }, true);
};

module.exports.deleteOne = function (req, res) {
  const id = req.params.id;
  commDao.removeDocumentById(Bookmark, id, function (err, removeSuccess) {
    if (err) {
      console.log(err);
      //res.status(404).json(err);
      res.status(500).json('api remove failed.' + err);
    }
    res.status(200).json({success: removeSuccess, id: id});
  });
};

/*
module.exports.readOne = function (req, res) {
  var id = req.params.id;
  sparesgroupDao.getBookmark(id, function (err, row) {
    if (err) {
      console.log(err);
      return res.status(404).json(err);
    }
    res.status(200).json(row);
  });
};//*/
