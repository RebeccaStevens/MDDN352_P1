Polymer({
	filepath: '',
	filesequence: '',
	imagecount: 1,
	firstimage: 1,
	autoload: false,
	autoplay: false,
	images: [],
	zeroPad: function(num, places) {
		var zero = places - num.toString().length + 1;
		return Array(+(zero > 0 && zero)).join("0") + num;
	},
	ready: function(){
		this.fs_prefix = this.filepath + this.filesequence.substring(0, this.filesequence.indexOf('#'));
		this.fs_postfix = this.filesequence.substring(this.filesequence.lastIndexOf('#') + 1, this.filesequence.length);
		this.fs_digits = this.filepath.length + this.filesequence.length - this.fs_prefix.length - this.fs_postfix.length;
		
		for(var i=0; i<this.imagecount; i++){
			this.images.push({
				src: this.fs_prefix + this.zeroPad(i+1, this.fs_digits) + this.fs_postfix,
				id: i
			});
		}
		
		if(this.autoplay){
			this.autoload = true;
		}
	},
	domReady: function(){
		if(!this.autoload){
			this.shadowRoot.querySelector('#image'+(this.firstimage-1)).setAttribute('src', this.fs_prefix + this.zeroPad(this.firstimage, this.fs_digits) + this.fs_postfix);
		}
		this.$.gallery.index = this.firstimage;
	}
});