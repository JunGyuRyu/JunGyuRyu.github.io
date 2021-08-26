var imagesObject = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]

<!-- 날짜 -->
var d=new Date();
var year=d.getFullYear();
var month=d.getMonth();
var day=d.getDate();
var date=document.querySelector("h1");
date.innerHTML+=(year+"년 "+(month+1)+"월 "+day+"일 ");


<!-- N일차 -->
var a=1;
var N=document.querySelector('h2');
N.innerHTML+= (a+"일차");


<!-- 완료 현황 -->
var suc=0;
var per=document.querySelector('h3');
per.innerHTML +=("완료 현황 : " + ((suc*100/a)+"%"));


<!-- prev, next버튼 기능구현 -->
var pre =document.getElementById('pre');
var next =document.getElementById('next');

pre.addEventListener("click", function() {
  if (a==1) {
    alert("이전 페이지가 존재하지 않습니다.");
  }
  
  else {
    a--;
    
    if(day==1) {
    
      if(month==0) {
        day=31;
        month=11;
        year=year-1;
      }
      
      else {
        day=32-new Date(year, (month-1), 32).getDate();
        month=month-1;
      }
    }
    
    else day--;
  }
  
  date.innerHTML=(year+"년 "+(month+1)+"월 "+day+"일 ");
  N.innerHTML= (a+"일차");
  per.innerHTML =("완료 현황 : " + ((suc*100/a)+"%"));



  loadFromLocalStorage();

  
});


next.addEventListener("click", function() {
  a++;

  if(day==32-new Date(year, month, 32).getDate()) {
    if(month==11) {
      year++;
      month=0;
      day=1;
    }
    
    else {
      month++;
      day=1;
    }
  }
  else day++;
  
  
  date.innerHTML=(year+"년 "+(month+1)+"월 "+day+"일 ");
  N.innerHTML= (a+"일차");
  per.innerHTML =("완료 현황 : " + ((suc*100)+"%"));


  loadFromLocalStorage();
  
  
});


<!-- 로컬에 사진 저장 -->

function handleFileSelect(evt) {
  var files = evt.target.files; 


  for (var i = 0, f; f = files[i]; i++) {
    

    if (!f.type.match('image.*')) {
      continue;
    }

    var reader = new FileReader();


    reader.onload = function(e) {
        displayImgData(e.target.result)
        addImage(e.target.result);
    };

    reader.readAsDataURL(f);
  }
  per.innerHTML =("완료 ");
  checkcp7=1;
 localStorage.setItem("cp7", JSON.stringify(checkcp7));
} 

function loadFromLocalStorage(){
var images = JSON.parse(localStorage.getItem(`images${a}`))
console.log(a)
document.getElementById('list').innerHTML = "";
console.log(images)
per.innerHTML =("미완료");
 checkcp7=0;
 localStorage.setItem("cp7", JSON.stringify(checkcp7));
if(images && images.length > 0){

  per.innerHTML =("완료");
   checkcp7=1;
 localStorage.setItem("cp7", JSON.stringify(checkcp7));
  images.forEach(displayImgData);
}
}

function addImage(imgData){
console.log(imagesObject)
console.log(a)
console.log(imagesObject.length)
imagesObject[a].push(imgData);

localStorage.setItem(`images${a}`, JSON.stringify(imagesObject[a]));
} 

function displayImgData(imgData){
var span = document.createElement('span');
span.innerHTML = '<img class="thumb" src="' + imgData + '"/>';
document.getElementById('list').insertBefore(span, null);
}

function deleteImages(){
imagesObject[a] = [];
localStorage.removeItem(`images${a}`);
per.innerHTML =("미완료");
 checkcp7=0;
 localStorage.setItem("cp7", JSON.stringify(checkcp7));
document.getElementById('list').innerHTML = "";
}

document.getElementById('files').addEventListener('change', handleFileSelect);
document.getElementById('deleteImgs').addEventListener("click", deleteImages);
loadFromLocalStorage();



<!-- 물 마시기 script -->
var wat1=document.querySelector(".empty1");
var wat2=document.querySelector(".empty2");
var wat3=document.querySelector(".empty3");

var watres=0;
var watrem=1500;
var wTres=document.querySelector('.waterres');


var ex=document.querySelector("#exempty");

function reload() {
  wTres.innerHTML="지금까지 마신 물의 양 : "+watres+"mL"
    +"<br/>"+"남은 물의 양 :"+watrem+"mL"
    +"<br/>" + "조금만 더 힘내세요!" + "<br/>";
}


wat1.addEventListener("click", function() {
  if(wat1.src==ex.src) {
    watres += 500;
    watrem -= 500;
    wat1.src="./image/full.png";
    
    if(watres==1500) wTres.innerHTML="물을 다 마셨습니다!";
    else reload();
  }
  
  else {
    alert("다른 물을 클릭해주세요!");
  }
})
wat2.addEventListener("click", function() {
  if(wat2.src==ex.src) {
    watres += 500;
    watrem -= 500;
    wat2.src="./image/full.png";
    if(watres==1500) wTres.innerHTML="물을 다 마셨습니다!";
    else reload();
  }
  
  else {
    alert("다른 물을 클릭해주세요!");
  }
})

wat3.addEventListener("click", function() {
  if(wat3.src==ex.src) {
    watres += 500;
    watrem -= 500;
    wat3.src="./image/full.png";
    if(watres==1500) wTres.innerHTML="물을 다 마셨습니다!";
    else reload();
  }
  
  else {
    alert("다른 물을 클릭해주세요!");
  }
})


pre.addEventListener("click", function() {
  wat1.src="./image/emp.png";
  wat2.src="./image/emp.png";
  wat3.src="./image/emp.png";
  wTres.innerHTML='';
  watres=0;
  watrem=1500;
})


next.addEventListener("click", function() {
  wat1.src="./image/emp.png";
  wat2.src="./image/emp.png";
  wat3.src="./image/emp.png";
  wTres.innerHTML='';
  watres=0;
  watrem=1500;
})

