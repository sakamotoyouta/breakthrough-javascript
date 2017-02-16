/**************************
*
*	Model
*
***************************/
function ModalModel(){
	this.index = 0;
	this.listeners = {
		changeImg: [],
		showImg: [],
	};
}
ModalModel.prototype.on = function(event,func){
	this.listeners[event].push(func);
};
ModalModel.prototype.trigger = function(event){
	$.each(this.listeners[event],function(){
		this();
	});
};
ModalModel.prototype.changeIndex = function(num,len){
	this.index = (this.index+num+len)%len;
	this.trigger('changeImg');
};
ModalModel.prototype.setIndex = function(index){
	this.index = index;
	this.trigger('showImg');
};
/**************************
*
*	View
*
***************************/
function ModalView(el){
	this.$container = $("#modal");
	this.$contents = $("#modal-contents");
	this.$overlay = $("#modal-overlay");
	this.$parents = $(el);
	this.$window = $(window);
	this.model = new ModalModel();
	this.len = this.$parents.find('a').length;
	this.handleEvents();
}
ModalView.prototype.handleEvents = function(){
	var self = this;
	this.$parents.on("click", "a" , function() {
		self.show(this);
		return false;
   });

	this.$container.on("click", "#modal-next", function()　{
		self.model.changeIndex(1,self.$parents.find('a').length);
		return false;
	});
   this.$container.on("click", "#modal-prev", function() {
     self.model.changeIndex(-1,self.$parents.find('a').length);
     return false;
   });
	this.model.on('changeImg',function(){
		self.slide();
	});
	this.model.on('showImg',function(){
		self.showImg();
	});

   this.$container.on("click", "#modal-close", function(e) {
     self.close();
     return false;
   });
   this.$overlay.on("click", function(e) {
     self.close();
     return false;
   });

   this.$window.on("load resize", function(){
     self.resize();
   });
};
ModalView.prototype.showImg = function(){
	var src = $("[data-index=\"" + this.model.index + "\"]").find("img").attr("src");
	this.$contents.html("<img src=\"" + src + "\" />");
};
ModalView.prototype.slide = function(){
	var self = this;
	var src = $("[data-index=\"" + this.model.index + "\"]").find("img").attr("src");
	//画像をスライドさせる
	this.$contents.find("img").fadeOut({
		complete: function() {
			$(this).attr("src", src).fadeIn();
		}
	});
};
ModalView.prototype.show = function(elem){
	this.$container.fadeIn();
	this.$overlay.fadeIn();
	this.model.setIndex($(elem).data('index'));
};
ModalView.prototype.close = function(){
	this.$container.fadeOut();
   this.$overlay.fadeOut();
};
ModalView.prototype.resize = function(){
	var w = this.$window.width();
	if(w < 640){
	  this.$container.css({"width": "320","height":"213"});
	}else{
	  this.$container.css({"width": "750","height":"500"});
	}
};
new ModalView('#modal-thumb');
