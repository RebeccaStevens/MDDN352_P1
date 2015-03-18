Polymer({
	cycle: false,
	index: 0,
	imageCount: 0,
	images: [],
	canZoom: false,
	canPlay: false,
	playing: false,
	autoplay: false,
	framerate: 12,
	playid: undefined,
	dialogopen: false,
	prevImage: function(){
		var i = this.index--;
		if(this.index < 0){
			this.index += this.imageCount;
		}
		this.updateImage(i);
	},
	nextImage: function(){
		var i = this.index++;
		if(this.index >= this.imageCount){
			this.index -= this.imageCount;
		}
		this.updateImage(i);
	},
	updateImage: function(oldIndex){
		if(oldIndex != undefined){
			if(this.images[oldIndex] == undefined){
				console.log(oldIndex);
			}
			this.images[oldIndex].className = this.images[oldIndex].className.replace(/\bactive\b/, '');
		}
		this.images[this.index].className += " active";
		this.canZoom = this.images[this.index].hasAttribute("hdsrc");
	},
	toggleGalleryPlay: function(){
		if(this.playing){
			this.pauseGallery();
		}
		else{
			this.playGallery();
		}
	},
	playGallery: function(){
		if(!this.playing){
			this.playing = true;
			var $this = this;
			this.playid = setInterval(function(){
				$this.nextImage();
			}, 1000 / this.framerate);
		}
	},
	pauseGallery: function(){
		if(this.playing){
			this.playing = false;
			clearInterval(this.playid);
		}
	},
	zoomImage: function(){
		this.$.imagedialog.open();
		this.$.hdimage.setAttribute("src", this.images[this.index].getAttribute("hdsrc"));
		this.$.hdimage.style.width = this.images[this.index].getAttribute("hdwidth") + 'px';
		this.$.hdimage.style.height = this.images[this.index].getAttribute("hdheight") + 'px';
	},
	ready: function(){
		if(this.autoplay){
			this.canPlay = true;
			this.playGallery();
		}
		
		var $this = this;
		this.$.swipedetector.addEventListener('down', function(e) {
			$this.pauseGallery();
			if($this.moveFrictionHandeler){
				clearInterval($this.moveFrictionHandeler);
			}
		});
		this.$.swipedetector.addEventListener('trackstart', function(e) {
			$this.trackStartX = e.clientX;
			$this.trackStartIndex = $this.index;
		});
		this.$.swipedetector.addEventListener('track', function(e) {
			var timestamp = new Date().getTime();
			var x = $this.trackStartX - e.clientX;
			var i = $this.index;
			
			$this.index = ((($this.trackStartIndex + parseInt(x / 10)) % $this.imageCount) + $this.imageCount) % $this.imageCount;
			$this.updateImage(i);
			
			//$this.trackspeed = (timestamp - $this.trackLastTimestamp) * ($this.trackLastX - e.clientX);
			//$this.trackLastX = e.clientX;
			//$this.trackLastTimestamp = timestamp;
		});
		this.$.swipedetector.addEventListener('trackend', function(e) {
			/*
			var time = 1000 / $this.framerate;
			var friction = 0.005;
			var dist = 0;
			
			$this.trackspeed = 0;
			
			if(Math.abs($this.trackspeed) < 0.05){
				$this.moveFrictionHandeler = setInterval(function(){
					dist += $this.trackspeed * (1 - Math.exp(-friction * time)) / friction;
					$this.trackspeed = $this.trackspeed * Math.exp(-friction * time);
					
					var i = $this.index;
					$this.index = Math.floor(dist / 20);
					$this.index = (($this.index % $this.imageCount) + $this.imageCount) % $this.imageCount;
					$this.updateImage(i);
	
					if(Math.abs($this.trackspeed) < 0.05){
						clearInterval($this.moveFrictionHandeler);
					}
				}, time);
			}
			*/
		});
	},
	domReady: function(){
		this.images = this.$.content.getDistributedNodes();
		
		this.imageCount = this.images.length;
		this.updateImage();
		
		var $this = this;
		document.addEventListener('keydown', function(e) {
		  switch(e.which) {
				case 82: // A
				case 37: // LEFT
					if(!$this.dialogopen && ($this.cycle || $this.index > 0)){
						$this.prevImage();
					}
					e.preventDefault();
				break;
				case 84: // D
				case 39: // RIGHT
					if(!$this.dialogopen && ($this.cycle || $this.index < $this.imageCount - 1)){
						$this.nextImage();
					}
					e.preventDefault();
					break;
				default: return;
			}
		});
		
		this.$.imagedialog.addEventListener('core-overlay-open-completed', function(e) {
			app.cantransition = false;
		});
		
		this.$.imagedialog.addEventListener('core-overlay-close-completed', function(e) {
			app.cantransition = true;
		});
	}
});