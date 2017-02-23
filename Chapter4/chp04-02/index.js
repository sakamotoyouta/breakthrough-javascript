  function App(url) {
    this.bindEvents();
    var self = this;
    this.fetch(url).then(function(data) {
      self.data = data;
    }, function(e) {
      console.error("データの取得に失敗しました");
    });
  }

  App.prototype.bindEvents = function() {
    _.bindAll(this, "onChange");
    $("select").on("change", this.onChange);
  };

  App.prototype.fetch = function(url) {
    return $.ajax({
      url: url,
      dataType: "json"
    });
  };

/**
*	selectのどちらかが変更されたら、sortを実行してfilterを実行する
*	sort or filter　どちらかのみを実行しないのはどちらかが既に選択されている場合に備えて
*/
  App.prototype.onChange = function(e) {
    var self = this;
	/**
	* whereに
	* [
	* function(list){return this.sort()}
	* ,function(list){return this.filter()}
	* ]
	* を代入
	*	要はsortとfilterを実行する関数を配列に整理する
	*	後からselect項目が増えても対応しやすい
	*
	*	[this.sort(),this.filter()]にしない理由は_.reduceでcurrent(prev)ができなくなるから
	*	this.sort(list,?)->this.filter(this.sort(list,?))になる
	*	クロージャで$el.val()を保持させてる
	*/
    var where = $("select").map(function(i, el) {
      var $el = $(el);
      return function(list) {
        return self[$el.attr("name")](list, $el.val());
      };
    });
	//  this.data.listはjsonオブジェクト全体
	//  function(this.data.list){return this.sort()},
	// function(function(this.data.list){return this.sort();}){return this.filter();}
	//	ソートしてフィルターしたリストが入る
    var list = _.reduce(where, function(prev, current) {
      return current(prev);
    }, this.data.list);
  };

  App.prototype.sort = function(list, key) {
    if (this.isEmpty(key)) {
      return list;
    }
    return _.sortBy(list, function(e) {
      return e[key];
    });
  };

  App.prototype.filter = function(list, value) {
    if (this.isEmpty(value)) {
      return list;
    }
    return _.filter(list, function(e) {
      return e["group"] === value;
    });
  };

  App.prototype.isEmpty = function(value) {
    return value === "";
  };

new App("data.json");
