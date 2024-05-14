let dataTable;
$("document").ready(function (){
    dataTable = $("table").DataTable({
        "ajax":{
            "url": "/api/customer" ,
            "dataSrc": ""
        },
        "columns": [
            {"data": "cusId"},
            {"data": "name"},
            {"data": "email"},
            {"data": "address"},
            {"data": function (customer) {
                return `
                    <button class="btn btn-outline-primary btn-sm" id="update-${customer.cusId}" onclick="initiateUpdate('${customer.cusId}')"> Update </button>
                    <button class="btn btn-outline-danger btn-sm" id="delete-${customer.cusId}" onclick="initiateDelete('${customer.cusId}')"> Delete </button>
                `
            }}
        ]
    })

});

const createCustomer = async () =>{
    showSpinner("#create-btn", {content: generalSpinner});
    hideModal("#createModal");
    try{
        const url = "/api/customer";
        let data = {
            name: $(".createForm #name").val(),
            email: $(".createForm #email").val(),
            address: $(".createForm #address").val()
        }

        const response = await fetch(url,{
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        const customer = await response.json();

        if(customer.error){
            return showError(customer.error);
        }

        dataTable.row.add(customer).draw();
        showSuccess("Customer created Successfully!");

    }catch(error){
        showError("Something went wrong!");
    }finally{
        hideSpinner("#create-btn", {content: "+ADD"})
    }
}

const initiateUpdate = async (id) =>{
    const url = `/api/customer/${id}`;
    try{
        const response = await fetch(url);
        const customer = await response.json();

        if(customer.error){
            return showError(customer.error);
        }

        $(".updateForm #name").val(customer.name);
        $(".updateForm #address").val(customer.address);
        $(".updateForm #hiddenId").val(id);

        showModal("#updateModal");

    }catch(error){
        showError("Something went wrong!");
    }
}

const updateCustomer = async () =>{
    const id = $(".updateForm #hiddenId").val();
    const url = `/api/customer/${id}`;
    try{
        showSpinner(`#update-${id}`, {content: generalSpinner});
        hideModal("#updateModal");
        
        const data = {
            name: $(".updateForm #name").val(),
            address: $(".updateForm #address").val()
        }
    
        const response = await fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const customer = await response.json();

        if(customer.error){
            return showError(customer.error);
        }

        const rowIndex = (document.querySelector(`#update-${id}`).parentElement.parentElement.rowIndex) - 1;
        dataTable.row(rowIndex).data(customer).draw();
        showSuccess("Customer updated!");

    }catch(error){
        showError("Something went wrong!");
    }finally{
        hideSpinner(`#update-${id}`, {content: "Update"});
    }
}

const initiateDelete = async (id) =>{
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this Data!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
              deleteCustomer(id);
            } else {
              swal("Your Data is safe!");
            }
          });
}

const deleteCustomer = async (id) =>{
    const url = `/api/customer/${id}`;
    try{
        showSpinner(`#delete-${id}`, {content: generalSpinner});

        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });
        const customer = await response.json();

        if(customer.error){
            return showError(customer.error);
        }

        const rowIndex = (document.querySelector(`#delete-${id}`).parentElement.parentElement.rowIndex) - 1;
        dataTable.row(rowIndex).remove().draw();
        showSuccess("Customer removed!");

    }catch(error){
        showError("Something went wrong!");
    }finally{
        hideSpinner(`#delete-${id}`, {content: "Delete"});
    }
}

$("document").ready(function (){
    const createForm = $(".createForm");
    const updateForm = $(".updateForm");

    createForm.validate({
        rules:{
            name: {
                required: true
            },
            email: {
                required: true
            },
            address: {
                required: true
            }
        }
    })

    updateForm.validate({
        rules:{
            name: {
                required: true
            },
            address: {
                required: true
            }
        }
    })

    createForm.on("submit", (event) =>{
        event.preventDefault();
        if(createForm.valid()){
            createCustomer();
            createForm[0].reset();
        }
    })

    updateForm.on("submit", (event) =>{
        event.preventDefault();
        if(createForm.valid()){
            updateCustomer();
            updateForm[0].reset();
        }
    })
});