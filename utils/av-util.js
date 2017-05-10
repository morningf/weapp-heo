const AV = require('../libs/av-weapp-min.js');
var util = require('../utils/util.js');
var app = getApp();

var queryPassageByObjectId = function(objectId, success, fail){
    var query = new AV.Query('Passage');
    query.get(objectId).then(function (pa) {
        pa.attributes.updatedAtStr = util.formatTime(pa.updatedAt);
        if (success)
            typeof success == "function" && success(pa);
    }, function (error) {
        if (fail)
            typeof fail == "function" && fail(error);
    });
}

var queryPassages = function(num, time, type, cb){
  var query = new AV.Query('Passage');
  if (type != "所有")
  {
    query.equalTo('type', type);
  }
  query.lessThan('updatedAt', time);
  query.limit(num);
  query.descending('updatedAt');
  query.find().then(function(results){
    for (var i = 0; i < results.length; ++i)
    {
        results[i].attributes.updatedAtStr = util.formatTime(results[i].updatedAt);
    }
    if (cb) typeof cb == "function" && cb(results);
  }, function(error){
    console.error(error);
  });
}

var queryMyPassages = function(num, time, success, fail){
  var query = new AV.Query('Passage');
  var user = AV.Object.createWithoutData("_User", app.globalData.userInfo.objectId);
  query.equalTo('user', user);
  query.lessThan('updatedAt', time);
  query.limit(num);
  query.descending('updatedAt');
  query.find().then(
    function(results){
        for (var i = 0; i < results.length; ++i) {
            results[i].attributes.updatedAtStr = util.formatTime(results[i].updatedAt);
        }
        if (success) typeof success == "function" && success(results);
    }, 
    function(error){
        if (fail) typeof fail == "function" && fail(error);
        console.error(error);
    });
}

var submitPassage = function(content, images, type, success, fail){
    //上传图片
    images.map(tempFilePath => () => new AV.File('filename', {
        blob: {
        uri: tempFilePath,
        },
    }).save()).reduce(
        (m, p) => m.then(v => AV.Promise.all([...v, p()])),
        AV.Promise.resolve([])
    ).then(
        files => {
            //提交
            var Passage = AV.Object.extend('Passage');
            var passage = new Passage();
            passage.set('type', type);
            passage.set('content', content);
            var user = AV.Object.createWithoutData("_User", app.globalData.userInfo.objectId);
            passage.set('user', user);
            passage.set("nickName", app.globalData.userInfo.nickName);
            passage.set("images", files.map(file => file.url()));
            passage.save().then(function(pa){
                if (success)
                    typeof success == "function" && success(pa);
            }, function(error){
                if (fail)
                    typeof fail == "function" && fail(error);
            });
        }
    ).catch(error=>{
        if (fail)
            typeof fail == "function" && fail(error);
    });
}

var deletePassage = function(objectId, success, fail){
    var passage = AV.Object.createWithoutData('Passage', objectId);
    passage.destroy().then(function (pa) {
        if (success)
            typeof success == "function" && success(pa);
    }, function (error) {
        if (fail)
            typeof fail == "function" && fail(error);
    });
}

var refreshPassage = function(objectId, success, fail){
    var passage = AV.Object.createWithoutData('Passage', objectId);
    passage.increment('refreshTimes', 1);
    passage.save().then(function(){
            if (success)
                typeof success == "function" && success();
        },
        function(error) {
            if (fail)
                typeof fail == "function" && fail(error);
        })
}

module.exports = {
    queryPassageByObjectId: queryPassageByObjectId,
    queryPassages: queryPassages,
    queryMyPassages: queryMyPassages,
    deletePassage: deletePassage,
    refreshPassage: refreshPassage,
    submitPassage: submitPassage
}