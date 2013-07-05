/**
 * ShadowCasting for Krosmaster Arena like games.
 *
 * Creative Common License Attribution : http://creativecommons.org/licenses/by-sa/3.0/fr/
 * @Author Drallieiv (@drallieiv) 
 *  
 * Based on "FOV using recursive shadowcasting" by Björn Bergström [bjorn.bergstrom@roguelikedevelopment.org]                                              
 *
 */     

  debug = false;
  gridSize= 6;
  
  function castShadow(x,y,mod){
  
    if(mod >0){
      setClass(x,y, "obstacle");
    }else{
      unsetClass(x,y, "obstacle");
    }
    
    /** Scan with Quadrants **/
      
      /** Absolute Values **/
      var ax = Math.abs(x);
      var flipX = 0;
      if(x != 0){
        flipX = x/Math.abs(x);
      }                   

      /** Min Max Slopes **/
      var slope1 = getSlope((ax-0.5),(y+0.5));
      var slope2 = getSlope((ax+0.5),(y-0.5));
      
      console.log("Slopes : "+slope1+" "+slope2)
      
      var flag=true;
      var firstX = ax;
      
      for(var cy = y; cy <= gridSize; cy++){
       for(var cx = firstX; cx <= gridSize; cx++){
          if(cx != x || cy != y){ /** Skip main cell */
            var slope = getSlope(cx,cy);
            
            if(debug){
              /*
              setTxt(cx*flipX,cy, Math.round((slope*100))/100);
              */
              setClass(cx*flipX,cy,"calc");
            } 
             
            if((slope > slope1) && (slope < slope2 || (slope2 < 0 && cx > x))){
              if(!flag){
                firstX = cx;
                flag=true;
              }
              
              mirrorHide(cx,cy,flipX,mod);
            }else{
              if(flag){
                break;
              }
            }           

          }        
        }
        if(flag){
          flag=false;
        }else{
          break;
        }
         
      }
  }
  
  function mirrorHide(cx,cy,flipX, mod){
    if(flipX >=0){
      shadow(cx,cy, mod)
    }
    if(flipX <=0){
      shadow(-cx,cy, mod)
    }
  }
  
  function shadow(x,y, mod){
    var cell = getCell(x,y);
    var shadow = parseInt(cell.attr('s'));
    shadow = shadow + mod;
    cell.attr('s',shadow);
    if(debug){
      setTxt(x,y, shadow);
    }
     
    if(shadow>0){
      cell.addClass("shadow");
    }else{
      cell.removeClass("shadow");
    }
  }
  
  function setClass(x,y,classname){
     getCell(x,y).addClass(classname);
  }
  
  function unsetClass(x,y,classname){
     getCell(x,y).removeClass(classname);
  }
  
  function setTxt(x,y,txt){
     getCell(x,y).html(txt);
  }
  
  function getCell(x,y){
    return $('td[x="'+x+'"][y="'+y+'"]');
  }
  
  function getSlope(a,b){
    if(b == 0){
      return 99
    }
    return a/b;
  }
  
  function autoResize(){
    
    var ratio = document.documentElement.clientWidth / document.documentElement.clientHeight;
    console.log(ratio);
       
    var boxSize = Math.round($('#dynamicTable').width()/(gridSize * 2 +1));
    
    if(ratio >= 16/9){
      boxSize = boxSize*0.85
    }
    
    $('#dynamicTable td').width(boxSize)
    $('#dynamicTable td').height(boxSize) 
  }
  
  window.onresize = function(event) {
    autoResize();
  }
  
  function reset(){
    initTable();
  }
    
  function initTable(){
    
    /** Init Table **/
    var table = "<table>";        
    for(var y=gridSize;y>=0;y--){ 
      table+='<tr>';
      for(var x=-gridSize;x<=gridSize;x++){ 
        table+='<td x="'+x+'" y="'+y+'" s="0">';
        if(debug){
          table+=x + ':' + y;
        }
        table+='</td>';
      }
      table+='</tr>';
    } 
    table+="</table>";
    
    $('#dynamicTable').html(table);
    autoResize();
            
    
    /** Place Hero **/
    setClass(0,0,"hero");
    
    /** Bind Events **/
    $('#dynamicTable td').bind("click", function(){
      var cell = $(this);
      if(cell.hasClass("hero")){
        return;
      }
      
      
      $.doTimeout(100, function(cell){
        var mod=+1;
        if($(cell).hasClass("obstacle")){
          mod=-1;
        }
              
        var x =parseInt($(cell).attr('x'));
        var y =parseInt($(cell).attr('y'));
        castShadow(x,y,mod)
      }, cell);
    });
    
    
    
    $(document).bind("contextmenu",function(e){
        return false;
    }); 
       
    $('#dynamicTable td').bind("contextmenu", function(){
      // Clear Marker
      $("td.marker").removeClass("marker");
      // Set new Marker 
      $(this).addClass("marker");
    });
  }