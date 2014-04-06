CorduleJS.addModule("Modal", (function(){
  var displayModal = function(modalOptions){
    
  }

  return {
    init: function(){
      CorduleJS.observe(this, "displayModal", displayModal)
    },
    destroy: function(){
    }
  }
})());
