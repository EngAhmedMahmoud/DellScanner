function device(device) {
    var device = JSON.parse(device);
    $("#Details_modal").show();
    $(".modal-title").html(device.name)
    var html = '';
    html += `<tr class="col"><td>IPAddress</td><td>${device.ip}</td></tr>`;
    html += `<tr class="col"><td>Port</td><td>${device.port}</td></tr>`;
    html += `<tr class="col"><td>Latitude</td><td>${device.lat}</td></tr>`;
    html += `<tr class="col"><td>Longitude</td><td>${device.lng}</td></tr>`;
    html += `<tr class="col"><td>Source</td><td>${device.source}</td></tr>`;
    html += `<tr class="col"><td>Name</td><td>${device.name}</td></tr>`;
    html += `<tr class="col"><td>Branch</td><td>${device.branch}</td></tr>`;
    html += `<tr class="col"><td>Group</td><td>${device.group}</td></tr>`;
    html += `<tr class="col"><td>CreatedAt</td><td>${device.created_at}</td></tr>`;
    $("#device_details").html(html);
}
$('.closemodal').click(function () {
    $('#Details_modal').hide();
});