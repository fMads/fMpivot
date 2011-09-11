var fMpivot;
function fMpivot(width,heightTop,heightMinimum,headerHover,contentMove,headerColor,headerColorHover) {
	this.width				= width;
	this.heightTop			= heightTop;
	this.heightMinimum		= heightMinimum;
	this.headerHover		= headerHover;
	this.contentMove		= contentMove;
	this.headerColor		= headerColor;
	this.headerColorHover	= headerColorHover;
	
	this.content1showing = false;
	this.firstRun = true;
	
	this.construct = function() {
		$('#pivotHeader > span.pivotFocus').animate({
			color: fMpivot.headerColorHover
		},1);
		$('#pivotHeader > span').hover(function() {
				$(this).animate({
					color: fMpivot.headerColorHover
				}, this.headerHover);
		}, function() {
			if($(this).hasClass('pivotFocus') != true) {
				$(this).animate({
					color: fMpivot.headerColor
				}, this.headerHover);
			}
		});
		
		this.runTab(this.current());
		
		this.firstRun = false;
	};
	
	this.heightTopNew = function(heightTopNew) {
		this.heightTop = heightTopNew;
		this.resize();
	};
	
	this.current = function(returnId) {
		if(returnId == true) {
			return $('#pivotHeader span.pivotFocus').attr("pivotid");
		} else {
			return parseInt($('#pivotHeader span.pivotFocus').attr("pivoti"));
		}
	};
	
	this.runTab = function(tab) {
		var i;
		switch(typeof(tab)) {
			case "number": {
				i = tab;
			}	break;
			case "string": {
				i = $('#pivotHeader span[pivotid="' + tab + '"]').attr("pivoti");
			}	break;
		}
		var pivotHeader = $('#pivotHeader span[pivoti=' + i + ']');
		if(typeof(pivotHeader.prop('onclick')) == 'function') {
			pivotHeader.prop('onclick').call();
		} else {
			this.gotoTab(i);
		}
	};
	
	this.gotoTab = function(tab,callback) {
		var i;
		this.content1hide();
		switch(typeof(tab)) {
			case "number": {
				i = tab;
			}	break;
			case "string": {
				i = $('#pivotHeader span[pivotid="' + tab + '"]').attr("pivoti");
			}	break;
		}
		
		$('#pivotHeader span.pivotFocus[pivoti!="' + i + '"]').removeClass("pivotFocus").animate({
				color:fMpivot.headerColor
			},this.headerHover
		);
		$('#pivotHeader span[pivoti="' + i + '"]:not(.pivotFocus)').addClass("pivotFocus").animate({
				color:fMpivot.headerColorHover
			},this.headerHover
		);
		
		var US = this.resize(true);
		var theHeight = US[0];
		var newHeight = US[1];
		
		$('#pivotContent div.pivotContent[pivoti="' + i + '"]').removeClass("pivotHide");
		$('#pivotContent').stop().animate({
				left: (-this.width * i) + 'px',
				height: theHeight + "px"
			},((this.firstRun == true) ? 0 : this.contentMove),function() {
				$('#pivotContent div[name="pivotContent"][pivoti!="' + i + '"]').addClass("pivotHide");
				if(typeof(callback) == "function") callback.call();
			}
		);
		$('#pivotContentOuter').stop().animate({
				height: newHeight + "px"
			},((this.firstRun == true) ? 0 : this.contentMove),function() {
				$(this).css("overflowY","auto");
			}
		);
	};
	
	this.content1show = function(text) {
		this.content1showing = true;
		
		$('#pivotContent div[name="pivotContent"][pivoti="' + this.current() + '"] div[name="pivotContent0"]').fadeTo(this.contentMove,0);
		if(text == undefined) {
			$('#pivotContent div[name="pivotContent"][pivoti="' + this.current() + '"] div[name="pivotContent1"]').fadeIn(this.contentMove);
		} else {
			$('#pivotContent div[name="pivotContent"][pivoti="' + this.current() + '"] div[name="pivotContent1"]').html(text).fadeIn(this.contentMove);
		}
		
		this.resize();
	};
	
	this.content1hide = function(callback) {
		this.content1showing = false;
		$('#pivotContent div[name="pivotContent"][pivoti="' + this.current() + '"] div[name="pivotContent0"]').fadeTo(500,1);
		$('#pivotContent div[name="pivotContent"] div[name="pivotContent1"]:visible').fadeOut(500,callback);
		this.resize();
	};
	
	this.resize = function(returnIt) {
		var newHeight = parseInt($(window).height() - this.heightTop);
		if(this.content1showing == false) {
			var theHeight = $('#pivotContent div[name="pivotContent"][pivoti="' + this.current() + '"] div[name="pivotContent0"]').height();
		} else {
			var theHeight = $('#pivotContent div[name="pivotContent"][pivoti="' + this.current() + '"] div[name="pivotContent1"]').height();
		}
		
		if(newHeight < this.heightMinimum) {
			newHeight = this.heightMinimum;
		}
		if(newHeight > theHeight) {
			newHeight = theHeight;
		}
		if(returnIt == true) return new Array(theHeight,newHeight);
		
		$('#pivotContent').stop().animate(
			{
				height: theHeight + "px"
			},((this.firstRun == true) ? 0 : this.contentMove)
		);
		$('#pivotContentOuter').stop().animate(
			{
				height: newHeight + "px"
			},((this.firstRun == true) ? 0 : this.contentMove),function() {
				$(this).css("overflowY","auto");
			}
		);
	};
	
	this.getContent = function(tab,contentI) {
		if(tab == undefined)
			tab = this.current();
			
		if(contentI === undefined)
			contentI = this.content1showing;
		
		if(typeof(tab) == "string")
			tab = $('#pivotHeader span[pivotid="' + tab + '"]').attr("pivoti");
		
		return $('#pivotContent div[name="pivotContent"][pivoti="' + tab + '"] div[name="pivotContent' + ((contentI == true) ? 1 : 0) + '"]');
	};
	
	this.ieTest = function() {
		var rv = -1; // Return value assumes failure.
		if(navigator.appName == 'Microsoft Internet Explorer') {
			var ua = navigator.userAgent;
			var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
			if(re.exec(ua) != null)
				rv = parseFloat(RegExp.$1);
		}
		return rv;
	};
}

function getInternetExplorerVersion() {
	var rv = -1; // Return value assumes failure.
	if(navigator.appName == 'Microsoft Internet Explorer') {
		var ua = navigator.userAgent;
		var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if(re.exec(ua) != null)
			rv = parseFloat(RegExp.$1);
	}
	return rv;
}
if(getInternetExplorerVersion() == 8) {
	document.body.onresize = function () {fMpivot.resize();};
} else {
	$(window).resize(function() {fMpivot.resize();});
}