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

function set_custom_proxy_server(server_info) {
	"use strict";
	// TODO
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
			$("#custom_proxy_enable")[0].checked = true;
		} else {
			$("#custom_proxy_proc").attr("disabled", true);
			$("#custom_proxy_addr").attr("disabled", true);
			$("#custom_proxy_test").attr("disabled", true);
			$("#custom_proxy_save").attr("disabled", true);
		}
	});

	$('#custom_proxy_enable').on("change", function() {
		if (this.checked) {
			$("#custom_proxy_proc").attr("disabled", false);
			$("#custom_proxy_addr").attr("disabled", false);
			$("#custom_proxy_test").attr("disabled", false);
			$("#custom_proxy_save").attr("disabled", false);
			show_proxy_message('success', 'Please proceed to Test and Save.');
		} else {
			$("#custom_proxy_proc").attr("disabled", true);
			$("#custom_proxy_addr").attr("disabled", true);
			$("#custom_proxy_test").attr("disabled", true);
			$("#custom_proxy_save").attr("disabled", true);
			// TODO
			// reset proxy setting
			// reset display
			// write message
		}
	});

	$('#custom_proxy_test').click(function() {
		var custom_proxy_proc = $('#custom_proxy_proc').val();
		var custom_proxy_addr = $('#custom_proxy_addr').val();
		
	});

	$('#custom_proxy_save').click(function() {
		
	});

	$('#form_custom_proxy_server').submit(function(event) {
		// prevent the default action of submitting a form
		event.preventDefault();
	});
});