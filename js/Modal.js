CorduleJS.addModule("Modal", (function(){
  var displayModal = function(tempRegData){
      var modal = document.getElementById('modal');
      var modalBackground = document.getElementById('modalBackground');
      var title = document.getElementById('label');
      var desc = document.getElementById('description');
      var save = document.getElementById('saveButton');
      var del = document.getElementById('deleteButton');
      var cancel = document.getElementById('cancelButton');

      modal.style.display = "inline";
      modalBackground.style.display = "inline";

      document.getElementById('label').value = tempRegData.label;
      document.getElementById('description').value = tempRegData.desc;
      save.onclick = function() {
          tempRegData.label = document.getElementById('label').value;
          tempRegData.desc = document.getElementById('description').value;
          tempRegData.callback(tempRegData);
          //save.onclick = "";
          modal.style.display = "none";
          modalBackground.style.display = "none";
      };
      if(del)
          del.onclick = function() {
              tempRegData.regEditMode = 'remove';
              tempRegData.label = document.getElementById('label').value;
              tempRegData.desc = document.getElementById('description').value;
              tempRegData.callback(tempRegData);
              modal.style.display = "none";
              modalBackground.style.display = "none";
          }
      if(cancel)
          cancel.onclick = function() {
              tempRegData.callback(tempRegData);
              modal.style.display = "none";
              modalBackground.style.display = "none";
          }
  }

  return {
    init: function(){
      CorduleJS.observe(this, "displayModal", displayModal)
    },
    destroy: function(){
    }
  }
})());
