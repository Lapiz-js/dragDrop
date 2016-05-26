// Based on https://jsfiddle.net/tovic/Xcb8d/
Lapiz.Module("DragDrop", ["UI"], function($L){
  var _selected = null;
  var x_elem, y_elem;
  var x_pos = 0;
  var y_pos = 0;
  var _noSelectS = ["WebkitUserSelect", "MozUserSelect", "MsUserSelect", "userSelect"];
  var _saveSelect = $L.Map();

  function _drag_init(e){
    var props = _dragProps.get(this);
    if (props.clone === true){
      _selected = this.cloneNode(true);
      this.parentNode.insertBefore(_selected, this.nextSibling);
      _selected.style.opacity = "0.7";
      _dragProps.set(_selected, props);
    } else {
      _selected = this;
    }
    _selected.style.position = "absolute";
    x_elem = e.offsetX;
    y_elem = e.offsetY;
    document.addEventListener("mousemove", _move_elem);
    document.addEventListener("mouseup", _drag_stop);
    var body = document.querySelector("body");
    $L.each(_noSelectS, function(key){
      _saveSelect[key] = body.style[key];
      body.style[key] = "none";
    });
  };

  function _move_elem(e){
    x_pos = document.all ? window.event.clientX : e.pageX;
    y_pos = document.all ? window.event.clientY : e.pageY;
    if (_selected !== null) {
      _selected.style.left = (x_pos - x_elem) + 'px';
      _selected.style.top = (y_pos - y_elem) + 'px';
    }
  }

  function _drag_stop(elem){
    var props = _dragProps.get(_selected);
    document.removeEventListener("mousemove", _move_elem);
    document.removeEventListener("mouseup", _drag_stop);
    var body = document.querySelector("body");
    $L.each(_noSelectS, function(key){
      body.style[key] = _saveSelect[key];
    });
    if (props.clone === true){
      _selected.remove();
    }
    _selected = null;
  };

  var _dragProps = new WeakMap();
  Lapiz.UI.attribute("draggable", function(node, ctx, attrVal){
    if (attrVal === undefined || attrVal === ""){
      attrVal = {};
    } else if ($L.typeCheck.string(attrVal)){
      attrVal = JSON.parse(attrVal);
    }
    _dragProps.set(node, attrVal);
    node.style.position = "relative";
    node.addEventListener("mousedown", _drag_init);
  });

  function _findHighestZIndex(node, highest){
    var z = $L.UI.getStyle(node, "z-index");
    if ( !(z < highest)){ // !< works with NaN
      highest = z;
    }
    $L.each(node.children, function(child){
      highest = _findHighestZIndex(child, highest);
    });
    return highest;
  }
});