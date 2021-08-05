	// calendar 함수
	function calendar(new_year, new_month){
		// 특정 年月을 시작일부터 조회(year, month, date)
		var	d = new Date(new_year, new_month-1, 1),
		    // 월별 일수 구하기
		    d_length = 32 - new Date(new_year, new_month-1, 32).getDate(),
		    year = d.getFullYear(),
		    month = d.getMonth(),
		    date = d.getDate(),
		    day = d.getDay();

		// caption 영역 날짜 표시 객체
		var caption_year = document.querySelector('.year'),
		    caption_month = document.querySelector('.month');

		var start_day = document.querySelectorAll('tr td');

		// 테이블 초기화
		for(var i = 0; i < start_day.length; i++){
			start_day[i].innerHTML = '&nbsp;';
		}

		// 한달치 날짜를 테이블에 시작 요일부터 순서대로 표시
		for(var i = day; i < day + d_length; i++){
		  start_day[i].innerHTML = date;
		  date++;
		}

		// caption 날짜 표시
		caption_year.innerHTML = year;
		caption_month.innerHTML = month + 1;		
	}
	

	(function(){
		var prev = document.getElementById('prev'),
			next = document.getElementById('next'),
			year = new Date().getFullYear(),
			month = new Date().getMonth() + 1;

		calendar(year, month);
		prev.onclick = function(){
			calendar(year, --month);
		};
		next.onclick = function(){
			calendar(year, ++month);
		};		

	})();
