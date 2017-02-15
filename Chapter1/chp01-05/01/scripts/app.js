/*****************************
*
*	Model
*
*	Viewから値を受け取りバリデーションの実行
*	オブザーバーもかねる
*
*******************************/
function AppModel(attrs){
	this.val = '';
	this.attrs = {
		required: '',
		maxlength: 8,
		minlength: 4,
	};
	this.listeners = {
		valid: [],
		invalid: []
	};
	this.erros = [];
}

Appmodel.prototype.on = function(event,func){
	this.listeners[event].push(func);
};

AppModel.prototype.trigger = function(event){
	$.each(this.listeners[event],function(){
		this();
	});
};

AppModel.prototype.set = function(val){
	if(this.val === val) return;
	this.val = val;
	this.validate();
};

AppModel.prototype.validate = function(){
	var validateOptionVal;
	this.errors = [];

	for(var key in this.attrs){
		validateOptionVal = this.attrs[key];
		if(!this.validateItem[key](validateOptionVal)) this.errors.push(key);
	}

	this.trigger(!this.errors.length ? 'valid':'invalid');
};

AppModel.prototype.validateItem = {
	required : function(){
		return this.val !== '';
	},
	maxlength : function(num){
		return num >= this.val.length;
	},
	minlength : function(num){
		return num <= this.val.length;
	}
};
