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
		var $caption_year = $('.year'),
		    $caption_month = $('.month');
		var $start_day = $('tr td');

		// 테이블 초기화
		$start_day.each(function(i){
			$(this).html('&nbsp;');
		});

		// 한달치 날짜를 테이블에 시작 요일부터 순서대로 표시
		for(var i = day; i < day + d_length; i++){
		  $start_day.eq(i).html(date);
		  date++;
		}

		// caption 날짜 표시
		$caption_year.html(year);
		$caption_month.html(month + 1);		
	}
	

	(function(){
		var $prev = $('#prev'),
			$next = $('#next'),
			year = new Date().getFullYear(),
			month = new Date().getMonth() + 1;

		calendar(year, month);

		$prev.click(function(){
			calendar(year, --month);		
		});

		$next.click(function(){
			calendar(year, ++month);
		});		

	})();
