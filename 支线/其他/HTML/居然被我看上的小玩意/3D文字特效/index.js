function setCss3(obj, attrObj) {
 for (var i in attrObj) {
  var newi = i;
  if (newi.indexOf("-") > 0) {
   var num = newi.indexOf("-");
   newi = newi.replace(newi.substr(num, 2), newi.substr(num + 1, 1).toUpperCase());
  }
  obj.style[newi] = attrObj[i];
  newi = newi.replace(newi.charAt(0), newi.charAt(0).toUpperCase());
  obj.style["webkit" + newi] = attrObj[i];
  obj.style["moz" + newi] = attrObj[i];
  obj.style["o" + newi] = attrObj[i];
  obj.style["ms" + newi] = attrObj[i];
 }
}

var s =
 "君不见，黄河之水天上来，奔流到海不复回。君不见，高堂明镜悲白发，朝如青丝暮成雪。人生得意须尽欢，莫使金樽空对月。天生我材必有用，千金散尽还复来。烹羊宰牛且为乐，会须一饮三百杯。 岑夫子，丹丘生，将进酒，杯莫停。与君歌一曲，请君为我倾耳听。钟鼓馔玉不足贵，但愿长醉不复醒。古来圣贤皆寂寞，惟有饮者留其名。陈王昔时宴平乐，斗酒十千恣欢谑。主人何为言少钱，径须沽取对君酌。五花马，千金裘，呼儿将出换美酒，与尔同销万古愁。";
window.onload = function() {
 var oScene = document.getElementsByClassName('scene')[0];
 var oUl = oScene.getElementsByTagName('ul')[0];
 var oDiv = oScene.getElementsByTagName('div')[0];
 var oTable = document.getElementsByClassName('table')[0];
 var aA = oTable.getElementsByTagName('a');
 var oItem = document.getElementsByClassName('item')[0];
 var oP = oScene.getElementsByTagName('p')[0];
 var aLi = oUl.getElementsByTagName('li');
 var r = 150;
 var circleArr = [];
 var coneArr = [];
 var coneNum = 0;
 var wordNum = -1;
 var liNub = 0;
 var theta = 0;
 var phi = 0;
 var layer = 0;
 var num = 0;
 var iTimer2 = 0;
 var graph = 1;
 var columnH = 0;
 var columnNum = 0;

 star();

 function star() {
  circleArr = [];
  coneArr = [];
  coneNum = 0;
  wordNum = -1;
  liNub = 0;
  theta = 0;
  phi = 0;
  layer = 0;
  num = 0;
  aA[graph - 1].className = '';
  graph = 1;
  aA[graph - 1].className = 'active';
  for (var i = 4; i < 13; i++) {
   num = i * i + (i + 1) * (i + 1);
   if (num >= s.length) {
    layer = (i - 1) * 2 + 1;
    break;
   }
   layer = (i - 1) * 2 + 1;
  }
  for (var i = 0; i < layer; i++) {
   if (i < (layer + 1) / 2) {
    wordNum += 2;
   } else {
    wordNum -= 2;
   }
   circleArr.push(wordNum);
  }
  num = 0;
  for (var i = 0; i < circleArr.length; i++) {
   theta = Math.PI / circleArr.length;
   phi = 2 * Math.PI / circleArr[i];
   for (var j = 0; j < circleArr[i]; j++) {
    var li = document.createElement('li');
    li.innerHTML = s[num];
    num++;
    drawCircle(li, theta, phi, i, j);
    oUl.appendChild(li);
   }
  }

  for (var i = 0; i < aLi.length; i++) {
   coneNum += 2 * i + 1;
   if (coneNum > aLi.length) {
    coneNum -= 2 * i + 1;
    break;
   }
   coneArr.push(2 * i + 1);
  }
  for (var i = 0; i < coneArr.length; i++) {
   phi = 2 * Math.PI / coneArr[i];
   for (var j = 0; j < coneArr[i]; j++) {
    drawCone(aLi[liNub], phi, i, j);
    liNub++;
   }
  }

  liNub = 0;
  columnH = Math.floor(aLi.length / (circleArr.length - 2));
  columnNum = columnH * (circleArr.length - 2);
  for (var i = 0; i < circleArr.length - 1; i++) {
   phi = 2 * Math.PI / columnH;
   for (var j = 0; j < columnH; j++) {
    drawColumn(aLi[liNub], phi, i, j);
    drawColumn2(aLi[liNub], phi, i, j);
    liNub++;
   }
  }
  for (var i = 0; i < aLi.length; i++) {
   setCss3(aLi[i], {
    transform: 'translate3D(' + aLi[i].circleX + 'px,' + aLi[i].circleY + 'px,' + aLi[i].circleZ +
     'px) rotateY(' + aLi[i].circlePhi + 'rad) rotateX(' + (aLi[i].circleTheta - Math.PI / 2) + 'rad)'
   });
  }

 }

 aA[0].onclick = function() {
  clearTimeout(iTimer2);
  aA[graph - 1].className = '';
  graph = 1;
  aA[graph - 1].className = 'active';
  startChange();
  if (oItem.bOff) {
   fn();
  } else {
   iTimer2 = setTimeout(function() {
    changeCircle();
   }, 500);
  }
 };
 aA[1].onclick = function() {
  clearTimeout(iTimer2);
  aA[graph - 1].className = '';
  graph = 2;
  aA[graph - 1].className = 'active';
  startChange();
  if (oItem.bOff) {
   fn();
  } else {
   iTimer2 = setTimeout(function() {
    changeCone();
   }, 500);
  }
 };
 aA[2].onclick = function() {
  clearTimeout(iTimer2);
  aA[graph - 1].className = '';
  graph = 3;
  aA[graph - 1].className = 'active';
  startChange();
  if (oItem.bOff) {
   fn();
  } else {
   iTimer2 = setTimeout(function() {
    changeColumn();
   }, 500);
  }
 };
 aA[3].onclick = function() {
  clearTimeout(iTimer2);
  aA[graph - 1].className = '';
  graph = 4;
  aA[graph - 1].className = 'active';
  startChange();
  if (oItem.bOff) {
   fn();
  } else {
   iTimer2 = setTimeout(function() {
    changeColumn2();
   }, 500);
  }
 };

 oScene.onmousedown = function(ev) {
  clearInterval(iTimer);
  var e = ev || event;
  var clickX = e.clientX;
  var clickY = e.clientY;
  var disX = 0;
  var disY = 0;
  document.onmousemove = function(ev) {
   var e = ev || event;
   disX = e.clientX - clickX;
   disY = e.clientY - clickY;
   setCss3(oDiv, {
    transform: 'rotateX(' + (angleX - disY) + 'deg) rotateY(' + (angleY + disX) + 'deg)'
   });
  }
  document.onmouseup = function() {
   document.onmousemove = null;
   document.onmouseup = null;
   angleX = angleX - disY;
   angleY = angleY + disX;
   if (disY == 0 && disX == 0) {
    disX = -300;
   }
   iTimer = setInterval(function() {
    angleX -= disY / 100;
    angleY += disX / 100;
    setCss3(oDiv, {
     transform: 'rotateX(' + angleX + 'deg) rotateY(' + angleY + 'deg)'
    });
   }, 60);
  }
  return false;
 };

 function drawCircle(obj, theta, phi, i, j) {
  obj.circleX = r * Math.sin(theta * i) * Math.sin(phi * j) + 200;
  obj.circleY = -r * Math.cos(theta * i) + 200;
  obj.circleZ = r * Math.sin(theta * i) * Math.cos(phi * j);
  obj.circleTheta = theta * (circleArr.length - i);
  obj.circlePhi = phi * j;
  obj.bigCircleX = (r + 2000) * Math.sin(theta * i) * Math.sin(phi * j) + 200;
  obj.bigCircleY = -(r + 2000) * Math.cos(theta * i) + 200;
  obj.bigCircleZ = (r + 2000) * Math.sin(theta * i) * Math.cos(phi * j);
  obj.maxX = obj.bigCircleX;
  obj.maxY = obj.bigCircleY;
  obj.maxZ = obj.bigCircleZ;
  obj.maxTheta = obj.circleTheta;
  obj.maxPhi = obj.circlePhi;

 }

 function drawColumn(obj, phi, i, j) {
  obj.columnX = r / 1.5 * Math.sin(phi * j) + 200;
  obj.columnY = (2 * r / (circleArr.length - 2)) * i + 50;
  obj.columnZ = (r / 1.5 * Math.cos(phi * j)).toFixed(2);
  obj.columnPhi = phi * j;
  obj.bigColumnX = (r + 2000) / 1.5 * Math.sin(phi * j) + 200;
  obj.bigColumnY = (2 * (r + 2000) / (circleArr.length - 2)) * i + 50 - 2000;
  obj.bigColumnZ = ((r + 2000) / 1.5 * Math.cos(phi * j)).toFixed(2);
 }

 function drawColumn2(obj, phi, i, j) {
  obj.column2X = r / 1.5 * Math.sin(phi * j + i * Math.PI / 180 * 8) + 200;
  obj.column2Y = (2 * r / (circleArr.length - 2)) * i + 50;
  obj.column2Z = (r / 1.5 * Math.cos(phi * j + i * Math.PI / 180 * 8)).toFixed(2);
  obj.column2Phi = phi * j + i * Math.PI / 180 * 8;
  obj.bigColumn2X = (r + 2000) / 1.5 * Math.sin(phi * j + i * Math.PI / 180 * 8) + 200;
  obj.bigColumn2Y = (2 * (r + 2000) / (circleArr.length - 2)) * i + 50 - 2000;
  obj.bigColumn2Z = ((r + 2000) / 1.5 * Math.cos(phi * j + i * Math.PI / 180 * 8)).toFixed(2);
 }

 function drawCone(obj, phi, i, j) {
  obj.coneX = (2 * r / coneArr.length) * i * Math.tan(30 * Math.PI / 180) * Math.sin(phi * j) + 200;
  obj.coneY = (2 * r / coneArr.length) * i + 50;
  obj.coneZ = (2 * r / coneArr.length) * i * Math.tan(30 * Math.PI / 180) * Math.cos(phi * j);
  obj.coneTheta = Math.PI / 6;
  obj.conePhi = phi * j;
  obj.bigConeX = (2 * (r + 2000) / coneArr.length) * i * Math.tan(30 * Math.PI / 180) * Math.sin(phi * j) + 200;
  obj.bigConeY = (2 * (r + 2000) / coneArr.length) * i + 50 - 2000;
  obj.bigConeZ = (2 * (r + 2000) / coneArr.length) * i * Math.tan(30 * Math.PI / 180) * Math.cos(phi * j);
 }
 function startChange() {
  for (var i = 0; i < aLi.length; i++) {
   aLi[i].className = 'all';
   setCss3(aLi[i], {
    transform: 'translate3D(' + aLi[i].maxX + 'px,' + aLi[i].maxY + 'px,' + aLi[i].maxZ + 'px) rotateY(' +
     aLi[i].maxPhi + 'rad) rotateX(' + (aLi[i].maxTheta - Math.PI / 2) + 'rad)'
   });
   aLi[i].style.opacity = 0;
  }
 }

 function changeCircle() {
  for (var i = 0; i < columnNum; i++) {
   aLi[i].className = '';
   aLi[i].maxX = aLi[i].bigCircleX;
   aLi[i].maxY = aLi[i].bigCircleY;
   aLi[i].maxZ = aLi[i].bigCircleZ;
   aLi[i].maxTheta = aLi[i].circleTheta;
   aLi[i].maxPhi = aLi[i].circlePhi;
   setCss3(aLi[i], {
    transform: 'translate3D(' + aLi[i].maxX + 'px,' + aLi[i].maxY + 'px,' + aLi[i].maxZ + 'px) rotateY(' +
     aLi[i].maxPhi + 'rad) rotateX(' + (aLi[i].maxTheta - Math.PI / 2) + 'rad)'
   });
  }
  setTimeout(function() {
   for (var i = 0; i < aLi.length; i++) {
    aLi[i].className = 'one';
    aLi[i].style.opacity = 1;
    setCss3(aLi[i], {
     transform: 'translate3D(' + aLi[i].circleX + 'px,' + aLi[i].circleY + 'px,' + aLi[i].circleZ +
      'px) rotateY(' + aLi[i].circlePhi + 'rad) rotateX(' + (aLi[i].circleTheta - Math.PI / 2) + 'rad)'
    });
   }
  }, 100);
 }

 function changeColumn() {
  for (var i = 0; i < columnNum; i++) {
   aLi[i].className = '';
   aLi[i].maxX = aLi[i].bigColumnX;
   aLi[i].maxY = aLi[i].bigColumnY;
   aLi[i].maxZ = aLi[i].bigColumnZ;
   aLi[i].maxTheta = 0;
   aLi[i].maxPhi = aLi[i].columnPhi;
   setCss3(aLi[i], {
    transform: 'translate3D(' + aLi[i].maxX + 'px,' + aLi[i].maxY + 'px,' + aLi[i].maxZ + 'px) rotateY(' +
     aLi[i].maxPhi + 'rad) rotateX(' + aLi[i].maxTheta + 'rad)'
   });
  }
  setTimeout(function() {
   for (var i = 0; i < columnNum; i++) {
    aLi[i].className = 'one';
    aLi[i].style.opacity = 1;
    setCss3(aLi[i], {
     transform: 'translate3D(' + aLi[i].columnX + 'px,' + aLi[i].columnY + 'px,' + aLi[i].columnZ +
      'px) rotateY(' + aLi[i].columnPhi + 'rad)'
    });
    console.log(aLi[i].columnZ, aLi[i].columnPhi);
   }
  }, 100);
 }

 function changeColumn2() {
  for (var i = 0; i < columnNum; i++) {
   aLi[i].className = '';
   aLi[i].maxX = aLi[i].bigColumn2X;
   aLi[i].maxY = aLi[i].bigColumn2Y;
   aLi[i].maxZ = aLi[i].bigColumn2Z;
   aLi[i].maxTheta = 0;
   aLi[i].maxPhi = aLi[i].column2Phi;
   setCss3(aLi[i], {
    transform: 'translate3D(' + aLi[i].maxX + 'px,' + aLi[i].maxY + 'px,' + aLi[i].maxZ + 'px) rotateY(' +
     aLi[i].maxPhi + 'rad) rotateX(' + aLi[i].maxTheta + 'rad)'
   });
  }
  setTimeout(function() {
   for (var i = 0; i < columnNum; i++) {
    aLi[i].className = 'one';
    aLi[i].style.opacity = 1;
    setCss3(aLi[i], {
     transform: 'translate3D(' + aLi[i].column2X + 'px,' + aLi[i].column2Y + 'px,' + aLi[i].column2Z +
      'px) rotateY(' + aLi[i].column2Phi + 'rad)'
    });
   }
  }, 100)
 }

 function changeCone() {
  for (var i = 0; i < coneNum; i++) {
   aLi[i].className = '';
   aLi[i].maxX = aLi[i].bigConeX;
   aLi[i].maxY = aLi[i].bigConeY;
   aLi[i].maxZ = aLi[i].bigConeZ;
   aLi[i].maxPhi = aLi[i].conePhi;
   aLi[i].maxTheta = aLi[i].coneTheta;
   setCss3(aLi[i], {
    transform: 'translate3D(' + aLi[i].maxX + 'px,' + aLi[i].maxY + 'px,' + aLi[i].maxZ + 'px) rotateY(' +
     aLi[i].maxPhi + 'rad) rotateX(' + aLi[i].maxTheta + 'rad)'
   });
  }
  setTimeout(function() {
   for (var i = 0; i < coneNum; i++) {
    aLi[i].className = 'one';
    aLi[i].style.opacity = 1;
    setCss3(aLi[i], {
     transform: 'translate3D(' + aLi[i].coneX + 'px,' + aLi[i].coneY + 'px,' + aLi[i].coneZ +
      'px) rotateY(' + aLi[i].conePhi + 'rad) rotateX(' + aLi[i].coneTheta + 'rad)'
    });
   }

  }, 100)

 }

 function fn() {
  oItem.bOff = false;
  setCss3(oItem, {
   transform: 'translateZ(-2000px) rotateX(-180deg)'
  });
  oItem.style.opacity = 0;
  oDiv.style.display = 'block';
  setTimeout(function() {
   switch (graph) {

    case 1:
     changeCircle();
     break;
    case 2:
     changeCone();
     break;
    case 3:
     changeColumn();
     break;
    case 4:
     changeColumn2();
     break;
   }
   aBtn[0].disabled = false;
   aBtn[1].disabled = false;
   oItem.style.display = 'none';
   setCss3(oItem, {
    transform: 'translateZ(0px) scale(2)'
   });
  }, 600);

 }
 var angleX = 0;
 var angleY = 0;
 var iTimer = setInterval(function() {
  angleY -= 3;
  setCss3(oDiv, {
   transform: 'rotateX(' + angleX + 'deg) rotateY(' + angleY + 'deg)'
  });
 }, 60);
}