// multifeild - connects several input fields to each-other
// By Yair Even Or / 2011 / dropthebit.com
;(function(){
	function keypress(e){
		var nextPrevField;

		if( !e.charCode && e.keyCode != 37 && e.keyCode != 39 && e.keyCode != 8 )			
			return;	
			
		// if hit Backspace key when the field it empty, go back one field		
		else if( (e.keyCode == 8 && this.selectionEnd ==0) || (e.keyCode == 37 && this.selectionEnd == 0) )			
			setCaret( $(this).prev(':text')[0], 100);
		
		else if( e.keyCode == 39 && this.selectionEnd == this.value.length )	
			setCaret( $(this).next(':text')[0], 0);
		
		// automatically move to the next field once user has filled the current one completely		
		if( e.charCode && this.selectionEnd == this.selectionStart && this.selectionStart == this.maxLength )
			setCaret( $(this).next(':text')[0], 100);

		function setCaret(input, pos){
			if( !input ) return;
			if (input.setSelectionRange){
				input.focus();
				input.setSelectionRange(pos, pos);
			}
			else if( input.createTextRange ){
				var range = input.createTextRange();
				range.collapse(true);
				range.moveEnd('character', pos);
				range.moveStart('character', pos);
				range.select();
			}
		}
		
		combine.apply(this);
	};
	// After each 'change' event of any of the fields, combine all the values to the hidden input.	
	function combine(){
		var hidden =  $(this).siblings('input[type=hidden]').val('')[0];		
		$(this.parentNode).find(':text').each( function(){			
			hidden.value += this.value;
		});
	}

	$('div.multi').on({'keypress.multifeild':keypress, 'change.multifeild':combine}, 'input');
})();