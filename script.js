window.onload = functino (){

    var w = window.innerWidth || 360;
    var h = window.innerHeight || 500;

    var tsw = ( w > h ) ? h : w;
    var sw = (tsw - 16 ) / 8;

    var container = document.getElementById("container");
    
    for(var n=0; n<64; n++){
        var square = document.createElementNS("div");
        square.classList.add("square");
        square.classList.add("s"+n);
        square.style.height = sw + 'px';
        square.style.width = sw + 'px';
        square.style.top = 7+(h-tsw)/2 + sw*(Math.floor(n/8)) + 'px';
        square.style.left = 7+(w-tsw)/2 + sw*(Math.floor(n/8)) + 'px';
        square.style.fontSize = sw*3/4 + 'px';
        container.appendChild(square);
    }

    var fonts = {
        'k' = : '&#9818;'
        'q' = : '&#9819'
        'r'
        'b
        'n'
        'p'
        'l'
        'w'
        't'
        'v'
        'm'
        'o' =
     } 
}