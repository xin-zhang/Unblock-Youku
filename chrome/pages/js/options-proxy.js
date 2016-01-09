var background = background || chrome.extension.getBackgroundPage();
var default_porxy_server_proc = background.unblock_youku.default_proxy_server_proc;
var default_porxy_server_addr = background.unblock_youku.default_proxy_server_addr;

function remove_custom_proxy_server(callback) {
	"use strict";

	background.remove_storage('custom_proxy_server', callback);
}

function get_custom_proxy_server(callback) {
	"use strict";
	background.get_storage('custom_proxy_server', function(server_info) {
		if (typeof server_info === 'undefined'
		|| typeof server_info.proc === 'undefined'
		|| typeof server_info.addr === 'undefined') {
			callback(/*custom_enabled=*/false, default_porxy_server_proc, default_porxy_server_addr);
		} else {
			callback(/*custom_enabled=*/true, server_info.proc, server_info.addr);
		}
	});
}

function test_custom_proxy_server(callback) {
	var test_url = 'http://ipservice.163.com/isFromMainland';
	show_proxy_test_message('info', 'Testing connection & Unblock...');
	$.get(test_url, function(data) {
		if (data === 'true') {
			show_proxy_test_message('success', 'Unblock OK.');
		} else {
			show_proxy_test_message('danger', 'Unblock test failed! Perhaps your server isn\'t located in mainland China.');
		}
	}).error(function() {
		show_proxy_test_message('danger', 'Unblock test failed! Perhaps the server isn\'t working properly.')
	});
}

function set_custom_proxy_server(server_proc, server_addr, callback) {
	"use strict";
	background.set_storage("custom_proxy_server", {
		proc : server_proc,
		addr : server_addr
	}, callback);
}

function show_proxy_message(type, content) {
	"use strict";
    var alert_type = 'info';
    if (type === 'success' || type === 'warning') {
        alert_type = type;  // success, info, or warning
    }

    $('#proxy_message').html('<div class="alert alert-' + alert_type + '"><button type="button" class="close" data-dismiss="alert">×</button>' + content + '</div>');
}

function show_proxy_error(content) {
    $('#proxy_message').html('<div class="alert alert-danger"><button type="button" class="close" data-dismiss="alert">×</button>' + content + '</div>');
}

function show_proxy_test_message(type, content) {
	"use strict";
    var alert_type = 'info';
    if (type === 'success' || type === 'warning' || type === 'danger') {
        alert_type = type;  // success, info, or warning
    }

    $('#proxy_test_message').html('<div class="alert alert-' + alert_type + '"><button type="button" class="close" data-dismiss="alert">×</button>' + content + '</div>');
}

$(document).ready(function() {
	"use strict";
	get_custom_proxy_server(function(custom_enabled, server_proc, server_addr) {
		$('#custom_proxy_proc option').each(function(idx, d) {
			if (d.value === server_proc) {
				d.selected = true;
			}
		});
		$('#custom_proxy_addr').val(server_addr);
		if (custom_enabled === true) {
			show_proxy_message('info', 'Status: Enabled');
			$("#custom_proxy_proc").attr("disabled", true);
			$("#custom_proxy_addr").attr("disabled", true);
			$("#custom_proxy_enable").attr("disabled", true);
		} else {
			show_proxy_message('info', 'Status: NOT Enabled');
			$("#custom_proxy_reset").attr("disabled", true);
		}
	});

	$('#custom_proxy_enable').click(function() {
		var custom_proxy_proc = $('#custom_proxy_proc').val();
		var custom_proxy_addr = $('#custom_proxy_addr').val();
		$("#custom_proxy_proc").attr("disabled", true);
		$("#custom_proxy_addr").attr("disabled", true);
		$("#custom_proxy_enable").attr("disabled", true);
		set_custom_proxy_server(custom_proxy_proc, custom_proxy_addr, function() {
			background.set_mode_name('normal', function() {
				$("#custom_proxy_reset").attr("disabled", false);
				show_proxy_message('success', 'Enabled custom proxy server, and changed to proxy mode.');
				test_custom_proxy_server();
			});
		});
	});

	$('#custom_proxy_reset').click(function() {
		$("#custom_proxy_reset").attr("disabled", true);
		remove_custom_proxy_server(function() {
			background.set_mode_name('normal', function() {
				$("#custom_proxy_proc").attr("disabled", false);
				$("#custom_proxy_addr").attr("disabled", false);
				$("#custom_proxy_enable").attr("disabled", false);
				show_proxy_message('success', 'Reset custom proxy server, and changed to proxy mode.');
				test_custom_proxy_server();
			});
		});
	});

	$('#form_custom_proxy_server').submit(function(event) {
		// prevent the default action of submitting a form
		event.preventDefault();
	});
});