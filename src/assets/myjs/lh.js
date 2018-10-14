!function(){
  var layerHelper = {};
  layerHelper.confirm = function(info,title,yesCB,cancelCB){
    layer.confirm(info,
      {icon: 3, title:title||'Confirm'},
      function(index) {
        if(yesCB) yesCB();
        layer.close(index);
      },
      function(index){
        if(cancelCB) cancelCB();
        layer.close(index);
      }
    );
  };

  layerHelper.openDlg = function(dlgPageUrl,dataObj,dlgTitle,dlgSize,maxSize){
    layer.open({
      type: 2,
      title: dlgTitle|| 'DlgTitle',
      maxmin: maxSize || false,
      closeBtn: 1,
      shadeClose: false,
      area: dlgSize || ['800px', '600px'],
      content: dlgPageUrl,
      success: function(layero, index) {
        var iframeWin = window[layero.find('iframe')[0]['name']];
        iframeWin.crtWinIndex = index;
        if(dataObj) {
          //iframeWin.location = dataObj;
          iframeWin.setDataObj(dataObj);
        }
      }
    });
  }


  layerHelper.downloadFile = function(fileContentUrl){
    $("<iframe/>").attr({
      src: fileContentUrl,
      style: "visibility:hidden;display:none"
    }).appendTo('body');
  }

  this.layerHelper = layerHelper;
 }();
