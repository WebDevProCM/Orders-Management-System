$("document").ready(function (){

const createModal = new bootstrap.Modal('#createModal');
const updateModal = new bootstrap.Modal('#updateModal');

generalSpinner =`<div class="spinner-grow text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>`

showModal = (name, option) =>{
    if(name === "#createModal"){
        return createModal.show();
    }
    if(name === "#updateModal"){
        return updateModal.show();
    }
}

hideModal = (name, option) =>{
    if(name === "#createModal"){
        return createModal.hide();
    }
    if(name === "#updateModal"){
        return updateModal.hide();
    }
}

showSuccess = (message, option) =>{
    toastr.success(message);
}

showError = (message, option) =>{
    toastr.error(message);
}

showSpinner = (selector, data, option) =>{
    $(selector).html(data.content);
    $(selector).prop("disabled", true)
}

hideSpinner = (selector, data, option) =>{
    $(selector).html(data.content);
    $(selector).prop("disabled", false)
}

});

