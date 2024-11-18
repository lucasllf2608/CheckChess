window.onload = function (){

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
        'k' : '&#9818;',
        'q' : '&#9819',
        'r' : '&#9820',
        'b' : '&#9821',
        'n' : '&#9822',
        'p' : '&#9823',
        'l' : '&#9812',
        'w' : '&#9813',
        't' : '&#9814',
        'v' : '&#9815',
        'm' : '&#9816',
        'o' : '&#9817'
     } 

     var values = ['r','n','b','q','k','b','n','r','p','p','p','p','p','p','p','p',0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'o','o','o','o','o','o','o','o','t','m','v','w','l','v','m','t'];
    
     var ck = false;
     var cr1 = false;
     var cr2 = false;
     var cl;

     var sqs = document.getElementsByClassName("square");

     for(var n = 0; n <64; n++){
        if(values[n] !==0){
           sqs[n].innerHTML = fonts[values[n]];
        }

        sqs[n].addEventListener("click",check);

     }

     function updateSquareColor(){
          for(var n=0; n<64; n++){
             if(Math.floor (n/8)%2==0){
                if(n%2===0){
                  sqs [n].style.background = '#9ff';
                } else {
                  sqs [n].style.background = '#5fa';
                }
             }
          }
     }

updateSquareColor();

var moveable = false;
var moveTarget = "";
var moverScopes = [];

function checkBlack(){
   var target = values[n];
   var scopes = [];
   var x = n;

   if( target === "o"){
      x-=8;
      if ("prnbkq".indexOf(values[x-1]) >= 0 && x%8 != 0) {
         scopes.push(x+1);
      }

      if ("prnbkq".indexOf(values[x-1]) >= 0 && x%8 != 7) {
         scopes.push(x+1);
      }

      if(x >= 0 && values [x-8] === 0){
         scopes.push(x);
         if(x >= 40){
            if(x-8 >= 0 && valus [x-8] === 0){
               scopes.push(x-8);
            }

         }
      }
   }

  
   else if( target === 't'){
      x = n;
      x -=8;
      while(x >=0){
        if(values[x] === 0){
            scopes.push(x);

        } 
        else if ("prnbqk".indexOf(values[x]) >= 0){
            scopes.push(x);
            break;
        } 
        else {
         break;
        }
        x -= 8;
      }

      x = n;
      x += 8;

      while(x >=64){
         if(values[x] === 0){
             scopes.push(x);
 
         } 
         else if ("prnbqk".indexOf(values[x]) >= 0){
             scopes.push(x);
             break;
         } 
         else {
          break;
         }
         x += 8;
       }
       x+n;
       x++;  
       x-=8;
       while(x % 8 != 0){
         if(values[x] === 0){
             scopes.push(x);
 
         } 
         else if ("prnbqk".indexOf(values[x]) >= 0){
             scopes.push(x);
             break;
         } 
         else {
          break;
         }
         x ++;
       }

       x = n;
       x --;

       while(x %8 != 7){
         if(values[x] === 0){
             scopes.push(x);
 
         } 
         else if ("prnbqk".indexOf(values[x]) >= 0){
             scopes.push(x);
             break;
         } 
         else {
          break;
         }
         x --;
       }
   }

   else if (target === 'm'){
       x = n;
       if(x%8 > 1 && x%8 < 6){
           x -= 17;
       }
   }


}
}