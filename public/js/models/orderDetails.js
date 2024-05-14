let dataTable;
$("document").ready(function (){
    const id =  $(".hiddenOrderId").text();
    dataTable = $("table").DataTable({
        "ajax":{
            "url": "/api/order/details/" + id,
            "dataSrc": ""
        },
        "columns": [
            {"data": "prodId"},
            {"data": function (orderDetail){
                return `
                    <img src="/images/products/${orderDetail.image}" class="order-detail-img">
                `
            }},
            {"data": "quantity"},
            {"data": "name"},
            {"data": "price"},
            {"data": "total"},
            {"data": function (orderDetail) {
                return `
                    <button class="btn btn-outline-primary btn-sm" id="update-${orderDetail.prodId}" onclick="initiateUpdate('${orderDetail.prodId}')"> Update </button>
                    <button class="btn btn-outline-danger btn-sm" id="delete-${orderDetail.prodId}" onclick="initiateDelete('${orderDetail.prodId}')"> Delete </button>
                `
            }}
        ]
    })

});

const createOrderDetail = async () =>{
    showSpinner("#create-btn", {content: generalSpinner});
    hideModal("#createModal");
    try{
        const url = "/api/order/details";
        let data = {
            prodId: $(".createForm #productId").val(),
            quantity: $(".createForm #quantity").val(),
            ordId: $(".hiddenOrderId").text()
        }

        const response = await fetch(url,{
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        const orderDetail = await response.json();

        if(orderDetail.error){
            return showError(orderDetail.error);
        }
        window.location.reload();
        showSuccess("OrderDetail created Successfully!");

    }catch(error){
        showError("Something went wrong!");
    }finally{
        hideSpinner("#create-btn", {content: "+ADD"})
    }
}

const initiateUpdate = async (id) =>{
    const ordId =$(".hiddenOrderId").text();
    const url = `/api/order/details/${ordId}/${id}`;
    try{
        const response = await fetch(url);
        const orderDetail = await response.json();

        if(orderDetail.error){
            return showError(orderDetail.error);
        }

        $(".updateForm #quantity").val(orderDetail.quantity);
        $(".updateForm #hiddenId").val(id);

        showModal("#updateModal");

    }catch(error){
        showError("Something went wrong!");
    }
}

const updateOrderDetail = async () =>{
    const id = $(".updateForm #hiddenId").val();
    const ordId =$(".hiddenOrderId").text();
    const url = `/api/order/details/${ordId}/${id}`;
    try{
        showSpinner(`#update-${id}`, {content: generalSpinner});
        hideModal("#updateModal");
        
        const data = {
            quantity: $(".updateForm #quantity").val()
        }
        const response = await fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        const orderDetail = await response.json();

        if(orderDetail.error){
            return showError(orderDetail.error);
        }

        const rowIndex = (document.querySelector(`#update-${id}`).parentElement.parentElement.rowIndex) -1;
        dataTable.row(rowIndex).data(orderDetail).draw();
        showSuccess("OrderDetail updated!");

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
              deleteOrderDetails(id);
            } else {
              swal("Your Data is safe!");
            }
          });
}

const deleteOrderDetails = async (id) =>{
    const ordId =$(".hiddenOrderId").text();
    const url = `/api/order/details/${ordId}/${id}`;
    try{
        showSpinner(`#delete-${id}`, {content: generalSpinner});

        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });
        const orderDetail = await response.json();

        if(orderDetail.error){
            return showError(orderDetail.error);
        }

        const rowIndex = (document.querySelector(`#delete-${id}`).parentElement.parentElement.rowIndex) - 1;
        dataTable.row(rowIndex).remove().draw();
        showSuccess("OrderDetail removed!");

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
            productId: {
                required: true
            },
            quantity: {
                required: true
            }
        }
    })

    updateForm.validate({
        rules:{
            quantity: {
                required: true
            }
        }
    })

    createForm.on("submit", (event) =>{
        event.preventDefault();
        if(createForm.valid()){
            createOrderDetail();
            createForm[0].reset();
        }
    })

    updateForm.on("submit", (event) =>{
        event.preventDefault();
        if(createForm.valid()){
            updateOrderDetail();
            updateForm[0].reset();
        }
    })
});