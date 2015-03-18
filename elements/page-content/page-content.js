Polymer({
	sections: [],
	section: 0,
	sectionCount: 0,
	page_scroll_can_transition: true,
	cantransition: true,
	nextSection: function(e) {
		if(!this.cantransition) return;
		if(!this.page_scroll_can_transition) return;
		if(this.$.pages.selected >=	this.$.sections.getDistributedNodes().length-1)	return;
		this.$.pages.selected += 1;
	},
	prevSection: function(e)	{
		if(!this.cantransition) return;
		if(!this.page_scroll_can_transition) return;
		if(this.$.pages.selected <=	0) return;
		this.$.pages.selected -= 1;
	},
	scrollToSection: function(prev){
		var	activeSection = this.$.sections.getDistributedNodes()[this.section];
		
		if(prev){
			if(activeSection.scrollTop > 0) return;
			this.prevSection();
		}
		else{
			if(activeSection.scrollTop < activeSection.scrollHeight - activeSection.clientHeight) return;
			this.nextSection();
		}
	},
	scrollSection: function(up){
		var	activeSection = this.$.sections.getDistributedNodes()[this.section];
		
		if(up){
			if(activeSection.scrollTop > 0){
				activeSection.scrollTop -= 100;
				activeSection.scrollTop = Math.max(activeSection.scrollTop, 0);
			}
			else{
				this.scrollToSection(true);
			}
		}
		else{
			var	maxScroll = activeSection.scrollHeight - activeSection.clientHeight;
			if(activeSection.scrollTop < maxScroll){
				activeSection.scrollTop += 100;
				activeSection.scrollTop = Math.min(activeSection.scrollTop,	maxScroll);
			}
			else{
				this.scrollToSection(false);
			}
		}
	},
	mouseWheelHandler: function(e)	{
		var	e =	window.event || e;
		var	delta = e.wheelDelta || -e.detail;

		this.scrollToSection(delta > 0);
	},
	page_transition_start: function(e){
		this.page_scroll_can_transition = false;
		this.$.drawer.closeDrawer();
		this.updateToolbar();
	},
	page_transition_end: function(e){
		this.page_scroll_can_transition = true;
	},
	updateToolbar: function(){
		if(this.section	== 0 && this.$.sections.getDistributedNodes()[0].scrollTop == 0){
			if(!this.$.mainToolbar.classList.contains('tall')){
				this.$.mainToolbar.className += ' tall';
			}
		}
		else{
			this.$.mainToolbar.className = this.$.mainToolbar.className.replace(/\btall\b/, '');
		}
	},
	ready: function(){
		this.addEventListener('mousewheel',	this.mouseWheelHandler,	false);			// IE9,	Chrome,	Safari,	Opera
		this.addEventListener('DOMMouseScroll',	this.mouseWheelHandler,	false);		// Firefox

		var	$this = this;
		document.addEventListener('keydown', function(e) {
			switch(e.which)	{
				case 87: //	W
				case 38: //	UP
					$this.scrollSection(true);
					e.preventDefault();
					break;
				case 83: //	S
				case 40: //	DOWN
					$this.scrollSection(false);
					e.preventDefault();
				break;
				default:	return;
			}
		});
			
		var	sections = this.$.sections.getDistributedNodes();
		this.sectionCount = sections.length;
			
		for(var	i=0; i<this.sectionCount; i++){
			this.sections.push({"sectionTitle":	sections[i].getAttribute("sectionTitle")});
		}
	}
});