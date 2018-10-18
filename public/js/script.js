$(document).ready(function () {
    $('.lastname').each(function() {
        $( this ).editable({
            success: function(response, newValue) {
                window.location.href = '/contactProject/contact';
            }
        });
    });
});
