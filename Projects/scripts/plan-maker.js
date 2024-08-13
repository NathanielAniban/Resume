$(document).ready(function(){
    var serviceCount = 0;

    function ParseData(index){
        $.getJSON('formData.json', function (data) {
            console.log(data);
            var data = data[index];
            $('#editserviceName').val(data.ServiceName);
            $('#editshortDescription').val(data.ShortDescription);
            $('#editcost').val(data.Cost);
            $('#editServiceType').val(data.ServiceType);


            $.each(data.listOfDescription, function(keys, object){
                var newItem = '<li class="mb-3 col-md-12">'+
                    '<div class="input-group">'+
                    '<input type="text" id="edit_serviceInput_'+keys+'" value="'+object+'" class="edit_service-input form-control col-md-8" disabled>'+
                        '<div class="btn-group col-md-4" role="group" aria-label="group">'+
                        '<button id="edit_editService_'+keys+'" class="edit_editService btn btn-secondary">Edit</button>'+
                        '<button id="edit_removeService_'+keys+'" class="edit_removeService btn btn-danger">Remove</button>'+
                        '</div>'+
                    '</div>'+
                '</li>'; // Create new list item with input and edit button
                $('#editservice-list').append(newItem); // Append new item to the list
            });
        });
    }
    
    $('input, textarea, select').focus(function(){
        $(this).removeClass('is-invalid');
    });

    $('#addService').click(function(){
        serviceCount++;
        var newItem = '<li class="mb-3 col-md-12">'+
                '<div class="input-group">'+
                '<input type="text" id="serviceInput_'+serviceCount+'" class="service-input form-control col-md-8">'+
                    '<div class="btn-group col-md-4" role="group" aria-label="group">'+
                    '<button id="editService_'+serviceCount+'" class="editService btn btn-secondary">Edit</button>'+
                    '<button id="removeService_'+serviceCount+'" class="removeService btn btn-danger">Remove</button>'+
                    '</div>'+
                '</div>'+
            '</li>'; // Create new list item with input and edit button
            $('#service-list').append(newItem); // Append new item to the list
        });

    $('#service-list').on('click', '.editService', function() {
        var $li = $(this).closest('li');
        var $input = $li.find('.service-input');
        var currentValue = $input.val();

        // Toggle between edit mode and view mode
        if ($(this).text() === 'Edit') {
        $input.prop('disabled', false).focus();
        $(this).text('Save');
        } else {
        $input.prop('disabled', true);
        $(this).text('Edit');
        }
        // Save the edited value
        $input.val(currentValue);
    }); 

    $('#service-list').on('click', '.removeService', function() {
        var serviceCount = $('#service-list').children().length;
        if (serviceCount > 0) {
            // Check if there are items to remove
            $(this).closest("li").remove();
            serviceCount--; // Decrement service count
        }
    });

    $('#submit').click(function(){
        var ServiceName = $('#serviceName').val();
        var Cost = $('#cost').val();
        var ShortDescription = $('#shortDescription').val();
        var ServiceType = $('#ServiceType').val();

        var miniDescription = $('#service-list li div').children('input');
        var Array = [];

        $.each(miniDescription, function(keys, object){
            if($('#serviceInput_'+(keys+1)).val() === ""){
                $('#serviceInput_'+(keys+1)).addClass('is-invalid');
            }else{
                Array.push($('#serviceInput_'+(keys+1)).val());
            }
        });

        if( $('#serviceName').val() === ""){
            $('#serviceName').addClass('is-invalid');
            return;
        }
        if(Cost === ""){
            $('#cost').addClass('is-invalid');
            return;
        }
        if(ShortDescription === ""){
            $('#shortDescription').addClass('is-invalid');
            return;
        }
        
        if(ServiceType === ""){
            $('#ServiceType').addClass('is-invalid');
            return;
        }

        var Data = {
            'ServiceName': ServiceName,
            'ShortDescription': ShortDescription,
            'Cost': Cost,
            'ServiceType': ServiceType,
            'listOfDescription': Array,
        };

        saveData(Data);

    });

    $('#show').click(function(){
        if(Filter()){
            $('#bullet-descriptions').empty();
            $('#service-name').html($('#serviceName').val());
            $('#short-description').html($('#shortDescription').val());
            $('#monthly').html(checkMonth($('#ServiceType').val()));
            $('#view-cost').html($('#cost').val());
            $('#bullet-descriptions').append(itterateList());
        }
    });

    function itterateList(){
        var miniDescription = $('#service-list li div').children('input');
        var list = '';
        $.each(miniDescription, function(keys, object){
            var data = $('#serviceInput_'+(keys+1)).val();
            list += '<li>'+data+'</li>';
        });

        return list;
    }

    function checkMonth(month){
        if(month == "Monthly"){
            return "Every month";
        }else if(month == "Bimonthly"){
            return "Every 2 months";
        }else if(month == "Trimonthly"){
            return "Every 3 months";
        }else if(month == "Quarterly"){
            return "Every 4 months";
        }else{
            return "Yearly";
        }
    }

    function Filter(){
        var Cost = $('#cost').val();
        var ShortDescription = $('#shortDescription').val();
        var ServiceType = $('#ServiceType').val();
        const thisCondition = true;
        var miniDescription = $('#service-list li div').children('input');

        $('input, textarea, select').focus(function(){
            $(this).removeClass('is-invalid');
        });
    

        $.each(miniDescription, function(keys, object){
            if($('#serviceInput_'+(keys+1)).val() == ""){
                $('#serviceInput_'+(keys+1)).addClass('is-invalid');
                thisCondition =  false;
            }
        });

        if( $('#serviceName').val() === ""){
            $('#serviceName').addClass('is-invalid');
            return false;
        }
        if(Cost === ""){
            $('#cost').addClass('is-invalid');
            return false;
        }
        if(ShortDescription === ""){
            $('#shortDescription').addClass('is-invalid');
            return false;
        }
        
        if(ServiceType === ""){
            $('#ServiceType').addClass('is-invalid');
            return false;
        }

        return thisCondition;
    }

    function saveData(formArray){
        var jsonString = JSON.stringify(formArray); // null, 2 for pretty formatting

        // Create a Blob object with the JSON string
        var blob = new Blob([jsonString], { type: 'application/json' });
        
        // Create a temporary URL for the Blob
        var url = URL.createObjectURL(blob);
        
        // Create a link element for downloading the file
        var a = document.createElement('a');
        a.href = url;
        a.download = 'formData.json';
        
        // Append the link element to the document body
        document.body.appendChild(a);
        
        // Trigger the click event of the link to start the download
        a.click();
        
        // Clean up: remove the link element and revoke the URL object
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

});
