console.log("where's the fire?");

var example = document.getElementById('example');
var context = example.getContext('2d');

example.addEventListener('click', function() {
    context.fillStyle = 'red';
    context.fillRect(30, 30, 50, 50);
});
