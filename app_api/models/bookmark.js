var mongoose = require('mongoose');
var BookmarkSchema = new mongoose.Schema({
  containerName: String,//组合名称
  containerIndex: {type: Number, default: 0},
  items: [{
    linkName: String,
    linkIndex: Number,
    linkUrl: String
  }]
});
mongoose.model('Bookmark', BookmarkSchema);