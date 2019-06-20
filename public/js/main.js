$(document).ready(function() {

    $("#generate").on("click", function(){
        let iban = generateIban();
        $("#iban").text(iban);
        
        if ($("#list li").length > 4) {
            $("#list li:first-child").remove();
            $("#list").append('<li>' + iban + '</li>');
        } else {
            $("#list").append('<li>' + iban + '</li>');
        }

        req = $.ajax({
            url: "/update",
            method: "POST",
            data: { iban: iban }
        });
    });



});





