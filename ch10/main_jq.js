var $banner = $('#banner'),			// 배너 본체
	$img = $banner.find('img'),		// 스프라이트 이미지
	$toggle = $('#toggle'),			// 배너 토글 버튼
	$sound_btn = $('#sound_btn');	// 사운드 토글 버튼

// 배너의 높이값 변수
var $banner_height = $banner.css('height');
var cast = []; // 풍선 객체

// 풍선 객체 생성 함수
function set_balloon(num){
	// 풍선의 속성값을 랜덤으로 생성
	var x = Math.floor(Math.random() * (500 - 10) + 10),
		y = Math.floor(Math.random() * (400 - 120) + 120),
		size = Math.floor(Math.random() * (200 - 100) + 100),
		angle = Math.floor(Math.random() * (360 - 0) + 0),
		speed = Math.random() * (2 - 0) + 0;

	// 풍선 객체
	cast[num] = {
	    x: x,			// x좌표
	    y: -y,			// y좌표
	    size: size,		// 사이즈
	    angle: angle,	// angle
	    speed: speed	// speed
	};		
}

function ball_init(){
	$img.each(function(i){
		// 풍선 객체들의 속성 초기화
		set_balloon(i);
		$img.eq(i)
			.css('left', '-9999px')	// 풍선의 x 좌표
	    	.css('top', '-9999px');	// 풍선의 y 좌표
	});
}

// 풍선 애니메이션 함수
function animate_balloon(){
 	$img.each(function(i){
 		// 벌룬 속성 변경
 		$img.eq(i)
 			.css('left', cast[i].x + 'px')	// x 좌표
	 		.css('top', cast[i].y + 'px')	// y 좌표
	 		.css('transform', 'rotate(' + cast[i].angle + 'deg)');	// 회전

	 	// 벌룬이 화면 안에 있으면
	    if(cast[i].y < parseInt($banner_height)){
	      cast[i].y += 1 + cast[i].speed;
	      cast[i].angle += cast[i].speed;
	    } else{	// 벌룬이 밑으로 나가면 
	    	set_balloon(i);
	    }	 		
 	});	// end each()
}	// end move_balloon()

function bgm_init(){
	var bgm = new Audio();	// 오디오 객체를 생성
	bgm.src = 'images/bgm.mp3';
	bgm.loop = true;
	$('body').append(bgm);	// 문서에 오디오 객체 추가
}


/* ------------------------------------------------------------------------ */
// 메인
ball_init();
setInterval(function(){ animate_balloon(); }, 1000/30);	
bgm_init();


/* ------------------------------------------------------------------------ */
// 사운드 버튼 이벤트
$sound_btn.click(function(event){
	var attr = $(this).attr('class');	// 사운드버튼의 class 속성	
	var bgm = $('audio');	// audio 객체

	if(attr == 'active'){
		// 사운드 off
		$(this).removeAttr('class');
		$(this).attr('src', 'images/sound_off.png');	// 버튼 이미지 교체
		bgm[0].pause();
	} else{
		// 사운드 on
		$(this).attr('class', 'active');
		$(this).attr('src', 'images/sound_on.png');
		bgm[0].play();
	}
	event.stopPropagation();	// 이벤트 버블링 금지
});

// 배너 열고닫기 버튼 이벤트
$toggle.click(function(){
	var attr = $banner.attr('class');

	if(attr == 'active'){
		// 배너 닫기
		$banner.removeAttr('class');
		$(this).html('배너 열기');
		return false;
	} else{
		// 배너 열기
		$banner.attr('class', 'active');
		$(this).html('배너 닫기');
		return false;
	}	
});

//	배너 링크 처리
$banner.click(function(){
	window.open('https://jungyuryu.github.io/', '_blank');
});
