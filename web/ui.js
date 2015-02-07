var scrollTimer = null;
var speedMulti = 1;
var speedBase = 1;

var epgOpenFullInfo = null;

function bootUi() {
	if ($(document.body).hasClass('epg')) {
		bootEpg();
	}
}

function scrollLeft() {
	var currentMargin = $('scroll-window').scrollLeft;
	if (currentMargin > 0) {
		var speed = speedBase * speedMulti;
		if (speedMulti < 7) speedMulti *= 1.05;
		$('scroll-window').scrollLeft = $('scroll-window').scrollLeft - speed;
	}
}

function scrollRight() {
	var currentMargin = parseInt($('scroll-epg-right').style.marginRight);
	
	var frameWidth = $('epg-frame').clientWidth;
	var tableWidth = $('epg-timetable').clientWidth;
	
	if ($('scroll-window').scrollLeft < (tableWidth - frameWidth)) {
		var speed = speedBase * speedMulti;
		if (speedMulti < 7) speedMulti *= 1.05;
		$('scroll-window').scrollLeft = $('scroll-window').scrollLeft + speed;
	}
}

function findPos(obj) {
	var curleft = curtop = 0;
	if (obj.offsetParent) {
		do {
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;
		} while (obj = obj.offsetParent);
	}
	return [curleft,curtop];
}

function loadMiniEpg() {
	$('epg-preloader').addClass('hidden');
	$('epg-frame').removeClass('hidden');
}

function liveWindowScroll() {
	var curTop = findPos($('epg-preloader'))[1];

	if (window.innerHeight + window.getScrollTop() > curTop) {
		setTimeout(loadMiniEpg, 1500); // demo
	}
}

function limitSpeedMulti() {
	if (speedMulti > 20) {
		speedMulti = 20;
	}
}

function bootEpg() {
	var channelNameOverlay = new Element("table.timetable");
	
	Array.each($$(".filler"), function(filler, index) {
		filler.destroy();
	});
	
	Array.each($$("td.channel-name"), function(channel, index) {
		var channelRow = new Element("tr");
		channelRow.grab(channel);
		channelNameOverlay.grab(channelRow);
	});
	$('channels-list-overlay').grab(channelNameOverlay);
	
	$('scroll-epg-left').addEvent('mouseover', function() {
		if (scrollTimer != null) window.clearInterval(scrollTimer);
		scrollTimer = window.setInterval(function() { scrollLeft(); }, 10);
	});
	
	$('scroll-epg-left').addEvent('mouseout', function() {
		window.clearInterval(scrollTimer);
		speedMulti = 0.1;
	});
	
	$('scroll-epg-left').addEvent('click', function() {
		speedMulti += 10;
		limitSpeedMulti();
	});
	
	$('scroll-epg-right').addEvent('mouseover', function() {
		if (scrollTimer != null) window.clearInterval(scrollTimer);
		scrollTimer = window.setInterval(function() { scrollRight(); }, 10);
	});
	
	$('scroll-epg-right').addEvent('mouseout', function() {
		window.clearInterval(scrollTimer);
		speedMulti = 0.1;
	});
	
	$('scroll-epg-right').addEvent('click', function() {
		speedMulti += 10;
		limitSpeedMulti();
	});
	
	Array.each($$("table.timetable tbody td div.full-info ul li a.grabbed"), function(item, index) {
		item.addEvent('mouseover', function() {
			item.firstChild.nodeValue = "Upuść teraz";
			item.addClass('drop-now');
		});
		item.addEvent('mouseout', function() {
			item.firstChild.nodeValue = "Złapałeś to!";
			item.removeClass('drop-now');
		});
	});
	
	window.addEvent('scroll', function() {
		liveWindowScroll();
	});
	
	Array.each($$("div.full-info"), function(item, index) {
		item.getParent().addEvent('click', function(e) {
			if (epgOpenFullInfo != null) {
				epgOpenFullInfo.removeClass('force-visible');
			}
			item.addClass('force-visible');
			epgOpenFullInfo = item;
			e.stop();
		});
		Array.each(item.getChildren("h4"), function(hitem, index) {
			var hideFullInfo = function(e) {
				item.removeClass('force-visible');
				epgOpenFullInfo = null;
				e.stop();
			};
			hitem.firstChild.addEvent('click', hideFullInfo);
			hitem.addEvent('click', hideFullInfo);
		});
	});
	
	$('epg-frame').addEvent('click', function(e) {
		if (epgOpenFullInfo != null) {
			epgOpenFullInfo.removeClass('force-visible');
			epgOpenFullInfo = null;
		}
	});
	
	Array.each($$("table.timetable tbody td > a"), function(item, index) {
		item.addEvent('click', function(e) {
			e.preventDefault();
		});
	});
}

var mobilePointerIsDown = false;
var mobilePointerBeginPosition = {x: undefined, y: undefined};
var mobilePointerLastPosition = {x: undefined, y: undefined};
var mobileInterfaceVariant = 0;

function completeOrCancel() {
	if (mobileInterfaceVariant == 750) {
		if ($('epg-frame')) {
			if (parseInt($('epg-frame').style.marginTop) < 112) {
				$('epg-frame').tween('margin-top', 85 + 'px');
			} else if (parseInt($('epg-frame').style.marginTop) >= 112) {
				$('epg-frame').tween('margin-top', 140 + 'px');
			}
		}
		
		if ($('recordings-list')) {
			if (parseInt($('recordings-list').style.marginTop) < 125) {
				$('recordings-list').tween('margin-top', 100 + 'px');
				$('search').tween('top', 30 + 'px');
			} else if (parseInt($('recordings-list').style.marginTop) >= 125) {
				$('recordings-list').tween('margin-top', 150 + 'px');
				$('search').tween('top', 85 + 'px');
			}
		}
	} else if (mobileInterfaceVariant == 450) {
		if ($('epg-frame')) {
			if (parseInt($('epg-frame').style.marginTop) < 75) {
				$('epg-frame').tween('margin-top', 50 + 'px');
			} else if (parseInt($('epg-frame').style.marginTop) >= 75) {
				$('epg-frame').tween('margin-top', 95 + 'px');
			}
		}
		
		if ($('recordings-list')) {
			if (parseInt($('recordings-list').style.marginTop) < 92) {
				$('recordings-list').tween('margin-top', 70 + 'px');
				$('search').tween('top', 5 + 'px');
			} else if (parseInt($('recordings-list').style.marginTop) >= 92) {
				$('recordings-list').tween('margin-top', 115 + 'px');
				$('search').tween('top', 50 + 'px');
			}
		}
	}
}

function mobilePointerDown(e) {
	mobilePointerIsDown = true;
	
	if (e.touches) {
		e = e.touches[0];
	}
	var currentPosition = e.client;
	mobilePointerLastPosition = currentPosition;
	mobilePointerBeginPosition = currentPosition;
}

function mobilePointerUp(e) {
	mobilePointerIsDown = false;
	var mobilePointerBeginPosition = {x: undefined, y: undefined};
	var mobilePointerLastPosition = {x: undefined, y: undefined};
	
	completeOrCancel();
}

function mobilePointerMove(e) {
	if (e.touches) {
		e = e.touches[0];
	}

	if (mobilePointerIsDown) {
		var currentPosition = e.client;
		var delta = {x: undefined, y: undefined};
		var startDelta = {x: undefined, y: undefined};
		
		delta.x = mobilePointerLastPosition.x - currentPosition.x;
		delta.y = mobilePointerLastPosition.y - currentPosition.y;
		
		startDelta.x = mobilePointerBeginPosition.x - currentPosition.x;
		startDelta.y = mobilePointerBeginPosition.y - currentPosition.y;
		
		//console.log(delta.x + ", " + delta.y);
		
		// Change in position is less than 10% of Y change
		if ((Math.abs(delta.x) < (Math.abs(delta.y) * 0.1)) && (Math.abs(startDelta.x) < (Math.abs(startDelta.y) * 0.1))) {
			if (document.body.hasClass('full-epg')) {
				if (
					((mobileInterfaceVariant ==  750) &&
						(((delta.y < 0) && (parseInt($('epg-frame').style.marginTop) < 140)) ||
						((delta.y > 0) && (parseInt($('epg-frame').style.marginTop) > 85)))) ||
					((mobileInterfaceVariant ==  450) &&
						(((delta.y < 0) && (parseInt($('epg-frame').style.marginTop) < 100)) ||
						((delta.y > 0) && (parseInt($('epg-frame').style.marginTop) > 50))))
				)
				{
					$('epg-frame').style.marginTop = (parseInt($('epg-frame').style.marginTop) - delta.y) + 'px';
					e.stop();
				}
			}
			
			if (document.body.hasClass('item-list')) {
				if (
					((mobileInterfaceVariant ==  750) &&
						(((delta.y < 0) && (parseInt($('recordings-list').style.marginTop) < 150)) ||
						((delta.y > 0) && (parseInt($('recordings-list').style.marginTop) > 100)))) ||
					((mobileInterfaceVariant ==  450) &&
						(((delta.y < 0) && (parseInt($('recordings-list').style.marginTop) < 115)) ||
						((delta.y > 0) && (parseInt($('recordings-list').style.marginTop) > 70))))
				)
				{
					$('recordings-list').style.marginTop = (parseInt($('recordings-list').style.marginTop) - delta.y) + 'px';
					$('search').style.top = (parseInt($('search').style.top) - delta.y) + 'px';
					e.stop();
				}
			} 
			
			if (mobileInterfaceVariant == 750) {
				if ($('epg-frame')) {
					if (parseInt($('epg-frame').style.marginTop) < 85) {
						$('epg-frame').style.marginTop = 85 + 'px';
					} else if (parseInt($('epg-frame').style.marginTop) > 140) {
						$('epg-frame').style.marginTop = 140 + 'px';
					}
				}
				
				if ($('recordings-list')) {
					if (parseInt($('recordings-list').style.marginTop) < 100) {
						$('recordings-list').style.marginTop = 100 + 'px';
						$('search').style.top = 30 + 'px';
					} else if (parseInt($('recordings-list').style.marginTop) > 150) {
						$('recordings-list').style.marginTop = 150 + 'px';
						$('search').style.top = 85 + 'px';
					}
				}
			} else if (mobileInterfaceVariant == 450) {
				if ($('epg-frame')) {
					if (parseInt($('epg-frame').style.marginTop) < 50) {
						$('epg-frame').style.marginTop = 50 + 'px';
					} else if (parseInt($('epg-frame').style.marginTop) > 95) {
						$('epg-frame').style.marginTop = 95 + 'px';
					}
				}
				
				if ($('recordings-list')) {
					if (parseInt($('recordings-list').style.marginTop) < 70) {
						$('recordings-list').style.marginTop = 70 + 'px';
						$('search').style.top = 5 + 'px';
					} else if (parseInt($('recordings-list').style.marginTop) > 115) {
						$('recordings-list').style.marginTop = 115 + 'px';
						$('search').style.top = 50 + 'px';
					}
				}
			}
		}
		
		if ((Math.abs(delta.y) < (Math.abs(delta.x) * 0.3)) && (Math.abs(startDelta.y) < (Math.abs(startDelta.x) * 0.3))) {
			if ($('scroll-window')) {
				$('scroll-window').scrollLeft = $('scroll-window').scrollLeft + delta.x;
				e.stop();
			}
		}
		
		mobilePointerLastPosition = currentPosition;
	}
}

function setMobileUi(width) {
	mobileInterfaceVariant = width;
}

function bootMobileUi() {
	window.addEvent('mousedown', mobilePointerDown);
	window.addEvent('touchstart', mobilePointerDown);
	window.addEvent('mouseup', mobilePointerUp);
	window.addEvent('touchend', mobilePointerUp);
	window.addEvent('mousemove', mobilePointerMove);
	window.addEvent('touchmove', mobilePointerMove);
	
	if (document.body.hasClass('full-epg')) {
		if (mobileInterfaceVariant == 750) {
			$('epg-frame').style.marginTop = '85px';
		} else if (mobileInterfaceVariant == 450) {
			$('epg-frame').style.marginTop = '50px';
		}
	}
	
	if (document.body.hasClass('item-list')) {
		if (mobileInterfaceVariant == 750) {
			$('recordings-list').style.marginTop = '100px';
			$('search').style.top = '30px';
		} else if (mobileInterfaceVariant == 450) {
			$('recordings-list').style.marginTop = '70px';
			$('search').style.top = '5px';
		}
	}
}

function resetMobileUi() {
	window.removeEvent('mousedown', mobilePointerDown);
	window.removeEvent('touchstart', mobilePointerDown);
	window.removeEvent('mouseup', mobilePointerUp);
	window.removeEvent('touchend', mobilePointerUp);
	window.removeEvent('mousemove', mobilePointerMove);
	window.removeEvent('touchmove', mobilePointerMove);
	
	if (document.body.hasClass('full-epg')) {
		$('epg-frame').style.marginTop = null;
	}
	
	if (document.body.hasClass('item-list')) {
		$('recordings-list').style.marginTop = null;
		$('search').style.top = null;
	}
}

myBreakpoints = new MooBreakpoints({ breakPoints: [750, 450] });

window.addEvent('onWidthEnter750', function() { setMobileUi(750); bootMobileUi(); });
window.addEvent('onWidthLeave750', function() { resetMobileUi(); });
window.addEvent('onWidthEnter450', function() { setMobileUi(450); bootMobileUi(); });
window.addEvent('onWidthLeave450', function() { resetMobileUi(); });

window.addEvent('domready', function() {
	bootUi();
});