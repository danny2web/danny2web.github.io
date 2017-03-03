
// 动画，是一个图标 slideUp()
// 每一个li的位置都是relative，动画图标position：absolute
// li.onmouseover = function () {
// 	icon.slideUp();
// }

$(function(){

	// 鼠标不滑过时banner动画自动播放，鼠标滑过时停止播放，对应hover(fun1, fun2);
	//   fun1 逐个显示图片，index==len时index设置为0循环 setInterval
	// 下方5个小圆点，鼠标悬停在其上时分别显示对应index的图片，并停止动画
	var addTimer = null;
	var index = 0;
	var $banner_wrapper = $(".banner_wrapper");
	var $banner_li = $banner_wrapper.find("li");
	// $banner_li.hide();
	var $span_all = $banner_wrapper.find("div").children("span");
	var len = $span_all.length;
	// console.log("all span: " + len);
	function showImg(index) {
		$banner_li.eq(index).fadeIn('slow').siblings().fadeOut('fast');
		$span_all.eq(index).css("backgroundColor", "#fff").siblings().css("backgroundColor", "#999");
		// console.log("index: " + index);
	}
	$span_all.mouseover(function () {
		var i = $span_all.index(this);
		showImg(i);
	});
	$banner_wrapper.hover(function () {
		if (addTimer) {
			clearInterval(addTimer);
		}
	}, function () {
		addTimer = setInterval(function () {
			showImg(index);
			index++;
			if (index == len) { index = 0; }
		}, 2500);
	}).mouseleave();


	// 右侧的sidebar_right的li在鼠标悬停时出现p并向右移动至接触
	// 主页上的display商品在鼠标悬停时向左移动n个px
	function moveTo(elem,x_pos,x_final,y_pos,y_final,interval) {
		var left = parseInt(elem.style.left);
		var top = parseInt(elem.style.top);
		if (!left) { left = x_pos; }
		if (!top) { top = y_pos}
		if (x_pos==x_final && y_pos==y_final && elem.movement) {
			clearTimeout(elem.movement);
			return true;
		}
		if (x_pos < x_final) { 
			x_pos += Math.ceil((x_final-x_pos)/1000); 
		}
		if (x_pos > x_final) { 
			x_pos -= Math.ceil((x_pos-x_final)/1000); 
		}
		if (y_pos < y_final) { 
			y_pos += Math.ceil((y_final-y_pos)/1000); 
		}
		if (y_pos > y_final) { 
			y_pos -= Math.ceil((y_pos-y_final)/1000); 
		}
		elem.style.left = x_pos + "px";
		elem.style.top = y_pos + "px";
		elem.movement = setTimeout(function () {
			moveTo(elem,x_pos,x_final,y_pos,y_final, interval);
		}, interval);
	}
	var $sidebar_li = $(".sidebar_right li");
	$sidebar_li.hover(function () {
		var p = $(this).children('p')[0];
		p.style.position = "absolute";
		moveTo(p, -120, -80, -13, -13, 5);
	}, function () {
		var p = $(this).children('p')[0];
		p.style.position = "absolute";
		p.style.left = -120 + "px";
	});

	// 导航栏中的每个li在鼠标悬停时出现猫的动画上升
	var $nav_li = $('header nav>ul li');
	$nav_li.hover(function () {
		$(this).find('img').show();
		var i = $nav_li.index(this);
		// console.log('cat up : ' + i);
	}, function () {
		$(this).find('img').hide();
	});
	
	// 提示demo是自己写的段落在网页顶部向左滚动
	var reminder = document.createElement('p');
	var reminder_msg = document.createTextNode("本页面是周其志自己写的demo，与天猫真实页面效果相同，请将鼠标滑至各处, 体验页面交互。谢谢! \n 愿你快乐充实每一天 !");
	reminder.appendChild(reminder_msg);
	document.body.appendChild(reminder);
	// reminder.style.display = "none";
	reminder.style.position = "absolute";
	reminder.style.left = "900px";
	reminder.style.top = "30px";
	reminder.style.color = "#00f";
	reminder.style.whiteSpace = "nowrap";
	var $reminder = $(reminder);
	// $reminder.animate({"left": "365px"}, 2000);
	moveTo(reminder, 600, 365, 30, 30, 25);

	// 直播区域大图，点击播放相应的视频
	var $live_big = $(".live_poster_big");
	var $live_big_img = $(".poster_big");
	var $play_button = $(".live_poster_big img").filter(":not('.poster_big')");
	var live_video =  document.getElementById('live_video');
	$play_button.click(function () {
		var big_poster_src = $live_big_img.attr('src');
		big_poster_num = big_poster_src.split('.')[0].slice(-1);
		var live_src = "images/live_" + big_poster_num + ".mp4";
		live_video.setAttribute('src', live_src);
		$live_big.hide();
		live_video.style.display = "block";
		live_video.play();
	});
	var $live_poster_small = $("ul.live_poster_small");
	var $live_poster_li = $live_poster_small.find('li')
	var $live_poster_li_a = $live_poster_small.find('a');
	$live_poster_li_a.click(function (e) {
		e.preventDefault();
		$play_button.click();
	});
	//  直播区域的上部大图片在鼠标滑过时，play按钮放大然后缩小
	function can_Play($elem, filter_img_class) {
		$elem.find('img').filter(":not('." + filter_img_class + "')").animate({
			"width" : "+=10px",
			"height" : "+=10px",
			"left" : "-=5px",
			"top" : "-=5px"
		}).animate({
			"width" : "-=10px",
			"height" : "-=10px",
			"left" : "+=5px",
			"top" : "+=5px"
		});
	}
	$(".live_poster_big").mouseenter(function () {
		can_Play($(this), "poster_big");
	});
	// 直播区域：鼠标滑过下方小缩略图时，上方直播屏幕图片换成对应的直播

	var $live_title = $(".live_poster_big h2");
	$live_poster_li.mouseenter(function () {
		var $img_poster_small = $(this).find('.poster_small');
		var $img_src = $img_poster_small.attr('src');
		var $img_class = $img_poster_small.attr('class');
		$live_big_img.attr('src', $img_src);
		$live_title.text($(this).find('h4').text());
		can_Play($(this), $img_class);
	});
	//  直播区域的缩略图的点击向左或向右滑动效果
	var next = document.createElement('div');
	next.setAttribute('class', "prev_next");
	var prev = document.createElement('div');
	prev.setAttribute('class', "prev_next");
	// console.log("next class: " + next.getAttribute('class') + ", prev class: " + prev.className);
	var next_span = document.createElement('span');
	var prev_span = document.createElement('span');
	var next_txt = document.createTextNode(">");
	var prev_txt = document.createTextNode("<");
	$live_poster_small.append(prev);
	$live_poster_small.append(next)
	var $prev_next = $('.prev_next'); 
	// console.log($prev_next.length);
	next.appendChild(next_span);
	prev.appendChild(prev_span);
	next_span.style.display = "inline-block";
	next_span.style.marginTop = "28px";	
	prev_span.style.display = "inline-block";
	prev_span.style.marginTop = "28px";
	var $next = $(next);
	var $prev = $(prev);
	$next.find('span').append(next_txt);
	$prev.find('span').append(prev_txt);
	$prev_next.css({
		"display": "none",
		"position": "absolute",
		"width": "18px",
		"height": "100%",
		"backgroundColor": "rgba(200,200,200,0.8)",
		"fontSize": "25px",
		"zIndex": "10",
		"display": "inline-block",
	});
	next.style.left = "470px";
	prev.style.left = "488px";
	// console.log("create prev_next done;");
	next.onclick = function () {
		$live_poster_small.animate({"left":"-488px"}, 500);
	};
	prev.onclick = function () {
		$live_poster_small.animate({"left":"0px"}, 500);
	};
	// 直播区域底部的预告滚动效果
	var $notice_right = $(".notice_right");
	function notice_repeat($elem, msg_total, initial_xpos, step) {
		var $top = parseInt($elem.css('top'));
		// console.log("$elem.height: " + $elem.height());
		if (!$top) { $top = initial_xpos; }
		if ($top <= initial_xpos + (msg_total-1)*step) {
			$elem.animate({'top':initial_xpos + (-step) +"px"}, 10).animate({
				'top': initial_xpos + "px"
			}, 500);
		} else {
			$elem.animate({'top': "+=" + step + "px"}, 500);
		}
	}
	setInterval(function () {
		notice_repeat($notice_right, 5, -8, -63);
	}, 3000);

	var $moving_msg = $(".msg_move div");
	setInterval(function () {
		notice_repeat($moving_msg, 3, 0, -30);
	}, 3000);
	// function notice_repeat() {
	// 	var top = parseInt($notice_right.css('top'));
	// 	console.log($notice_right.height());
	// 	if (!top) { top = -8; }
	// 	if (top <= -248) { 
	// 		$notice_right.animate({'top': "-8px"}, 1000); 
	// 	} else {
	// 		$notice_right.animate({'top': "+=" + (-63) + "px"}, 1000);
	// 	}
	// }
	

	// brand_promo展示区域的叠加在品牌图片上的div全部隐藏，在mouseenter时display
	$(".brand_promo li .promo_voucher").hide();
	$(".brand_promo li .brand_image").mouseenter(function () {
		$(this).siblings().fadeIn().parent().siblings().find(".promo_voucher").hide().mouseleave(function () {
			$(this).hide();
		});
	});

	// brand_promo展示区域 右侧底部的换一批动画效果
	var $brand_promo = $(".brand_promo");
	var $brand_promo_ul = $brand_promo.find('ul');
	var $brand_promo_len = $brand_promo_ul.length;
	var idx = 0;
	// console.log("brand_promo: " + $brand_promo_len);
	$brand_promo_ul.eq(0).show().siblings('ul').hide();
	$(".change_next a").hover(function () {
		$(this).find('img').attr('src', "images/rotate_2.png");
	}, function () {
		$(this).find('img').attr('src', "images/rotate.png");
	}).click(function (e) {
		e.preventDefault();
		$brand_promo_ul.eq(idx+1).show().siblings('ul').hide();
		idx++;
		if (idx == $brand_promo_len - 1) {
			idx = -1;
		}
	});

	// classification区域的图片在mouseenter时变大， mouseleave时恢复
	$(".classification li ul li").mouseenter(function () {
		$(this).find('img').animate({
			"width":"+=10px",
			"height": "+=10px",
			"margin": "-=5px"
		}, 200);
	}).mouseleave(function () {
		$(this).find('img').animate({
			"width":"-=10px",
			"height": "-=10px",
			"margin": "+=5px"
		}, 200);
	});


	// 右侧sidebar最下面的top图片在scroll时出现，在滑动到最顶部时消失
	// 左侧sidebar的交互效果
	var scroll_Top;
	var $back_to_Top = $(".sidebar_right li:last-child a img");	
	var $sidebar_left = $(".sidebar_left");
	var k;
	var bg_color;
	document.onscroll = function () {
		scroll_Top = document.body.scrollTop;
		if (scroll_Top != 0) { $back_to_Top.fadeIn(); }
		if (scroll_Top == 0) { $back_to_Top.hide(); }
		console.log(scroll_Top);
		if (scroll_Top < 500) {
			$sidebar_left.hide();
		} else if (scroll_Top >= 500) {
			$sidebar_left.show();
		} 
		if ( scroll_Top >= 1700 && scroll_Top <2200 ) {
			scroll_bgColor(0);
		} 
		if ( scroll_Top >= 2200 && scroll_Top < 2800 ) {
			scroll_bgColor(1);
		} 
		if ( scroll_Top >= 2800 && scroll_Top <3200 ) {
			scroll_bgColor(2);
		} 
		if ( scroll_Top >= 3200 && scroll_Top < 3900 ) {
			scroll_bgColor(3);
		} 
		if ( scroll_Top >= 3900 && scroll_Top <4400 ) {
			scroll_bgColor(4);
		} 
		if ( scroll_Top >= 4400 && scroll_Top < 5000 ) {
			scroll_bgColor(5);
		} 
		if (scroll_Top >= 5000 ) {
			scroll_bgColor(6);
		}
	}; 

	var $li_1_6 = $sidebar_left.children('li').filter(":not(':last-child')").filter(":not(':first-child')");
	function scroll_bgColor(k) {
		bg_color = $(".slogan_sector").eq(k).find('h2').find('i').css("backgroundColor");
		$li_1_6.css("backgroundColor", "rgba(170,170,170,0.6)").eq(k).css("backgroundColor", bg_color);			
		if (k==6) {
			$li_1_6.css("backgroundColor", "rgba(170,170,170,0.6)").eq(k).css("backgroundColor", "#DD2727");
		}
	}
	function hover_bgColor(k) {
		bg_color =  $(".slogan_sector").eq(k).find('h2').find('i').css("backgroundColor");
		$li_1_6.eq(k).css("backgroundColor", bg_color);	
		if (k == 6) { 
			$li_1_6.eq(k).css("backgroundColor", "#000");
		}
	}

	var li_idx;
	$li_1_6.mouseenter(function () {
		li_idx = $li_1_6.index(this);
		hover_bgColor(li_idx);
	}).mouseleave(function () {
		$li_1_6.eq(li_idx).css("backgroundColor", "rgba(170,170,170,0.6)");
	});
	$li_1_6.find('a').click(function (e) {
		e.preventDefault();
		li_idx =$li_1_6.index($(this).parent());
		scroll_Top = 1700 + li_idx*550;
		document.body.scrollTop = scroll_Top;
	});

	var header = document.getElementsByTagName('header')[0];
	// alert($(document).width());

	// for (var i = 0; i < 5; i++) {
	// 	setTimeout(function () {
	// 		console.log(i);
	// 	}, 1000*i);
	// }
		
});