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

$(document).ready(function() {
	"use strict";
	get_custom_proxy_server(function(custom_enabled, server_proc, server_addr) {
		$('...').val(custom_enabled);
		$('...').val(server_proc);
		$('...').val(server_addr);
	});
});