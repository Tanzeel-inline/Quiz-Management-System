/*$(document).ready(function(){
    
    
});*/

function inputChanged(event) {
    event.target.parentElement.parentElement.className =
    event.target.checked ? 'selected' : '';
}
  
function printSelected() {
    var textArea = document.getElementsByTagName('textarea')[0];
    textArea.value = '';

    var selectedRows = document.getElementsByClassName('selected');
    for (var i = 0; i < selectedRows.length; ++i) {
        console.log(selectedRows[i].textContent.trim());
        textArea.value += selectedRows[i].textContent.trim() + '\n';
    }
}
