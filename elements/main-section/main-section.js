Polymer({
	ready: function(){
		var $this = this;
		this.onscroll = function(){
			$this.parentNode.updateToolbar();		
		}
	}
});