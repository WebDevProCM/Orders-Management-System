let dataTable;
$("document").ready(function (){
    dataTable = $("table").DataTable({
        "ajax":{
            "url": "/api/order",
            "dataSrc": ""
        },
        "columns": [
            {"data": "ordId"},
            {"data": "customer.name", "width": "8%"},
            {"data": function (order) {
            return new Date(order.orderDate).toDateString();
            }},
            {"data": function (order) {
                return new Date(order.deliveryDate).toDateString();
            }},
            {"data": "totalAmount", "width": "8%"},
            {"data": function (order) {
                if(order.status == "0"){
                    return `<p style="color:red;">Cancelled</p>  <input type="hidden" value="cancelled" id="hiddenStatus">`
                }
                if(order.status == "1"){
                    return `Preparing <input type="hidden" value="preparing" id="hiddenStatus">`
                }
                if(order.status == "2"){
                    return `Dispatched <input type="hidden" value="dispatched" id="hiddenStatus">`
                }
                if(order.status == "3"){
                    return `Delivered <input type="hidden" value="delivered" id="hiddenStatus">`
                }
            }},
            {"data": "paid", "width": "5%"},
            {"data": function (order) {
                return `
                    <button class="btn btn-outline-primary btn-sm" id="update-${order.ordId}" onclick="initiateUpdate('${order.ordId}')"> Update </button>
                    <a href="/orders/details/${order.ordId}" class="btn btn-outline-dark btn-sm" id="details-${order.ordId}"> Details </button>
                `
            }}
        ]
    })

});
const createOrder = async () =>{
    showSpinner("#create-btn", {content: generalSpinner});
    hideModal("#createModal");
    try{
        const url = "/api/order"
        let data = {
            customer: $(".createForm #customerId").val(),
            orderDate: $(".createForm #orderedDate").val(),
            deliveryDate: $(".createForm #deliveryDate").val(),
            paid: $(".createForm #paid").val(),
            status: $(".createForm #status").val()
        }

        const response = await fetch(url,{
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        const order = await response.json();

        if(order.error){
            return showError(order.error);
        }

        dataTable.row.add(order).draw();
        showSuccess("Order created Successfully!");

    }catch(error){
        showError("Something went wrong!");
    }finally{
        hideSpinner("#create-btn", {content: "+ADD"})
    }
}

const initiateUpdate = async (id) =>{
    const url = "/api/order/" + id;
    try{
        const response = await fetch(url);
        const order = await response.json();

        if(order.error){
            return showError(order.error);
        }

        $(".updateForm #orderedDate").val(new Date(order.orderDate).toISOString().slice(0,10));
        $(".updateForm #deliveryDate").val(new Date(order.deliveryDate).toISOString().slice(0,10));
        $(".updateForm #paid").val(order.paid);
        $(".updateForm #status").val(order.status);
        $(".updateForm #hiddenId").val(id);

        showModal("#updateModal");

    }catch(error){
        showError("Something went wrong!");
    }
}

const updateOrder = async () =>{
    const id = $(".updateForm #hiddenId").val();
    const url = "/api/order/" + id;
    try{
        showSpinner(`#update-${id}`, {content: generalSpinner});
        hideModal("#updateModal");
        
        const data = {
            orderDate: $(".updateForm #orderedDate").val(),
            deliveryDate: $(".updateForm #deliveryDate").val(),
            paid: $(".updateForm #paid").val(),
            status: $(".updateForm #status").val()
        }

        const response = await fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        const order = await response.json();

        if(order.error){
            return showError(order.error);
        }

        const rowIndex = (document.querySelector(`#update-${id}`).parentElement.parentElement.rowIndex) - 1;
        dataTable.row(rowIndex).data(order).draw();
        showSuccess("Order updated!");

    }catch(error){
        showError("Something went wrong!");
    }finally{
        hideSpinner(`#update-${id}`, {content: "Update"});
    }
}

const updateAllOrders = () =>{
    const tdInput = document.querySelectorAll("#hiddenStatus");

    tdInput.forEach((input) =>{
        input.parentElement.parentElement.classList.remove("hiddenTr")
    });

}

const updateActive = () =>{
    const tdInput = document.querySelectorAll("#hiddenStatus");

    tdInput.forEach((input) =>{
        input.parentElement.parentElement.classList.remove("hiddenTr")
    });

    tdInput.forEach((input) =>{
        if(input.value !== "preparing" && input.value !== "dispatched"){
            input.parentElement.parentElement.classList.add("hiddenTr")
        }
    })

}

const updatePending = () =>{
    const tdInput = document.querySelectorAll("#hiddenStatus");

    tdInput.forEach((input) =>{
        input.parentElement.parentElement.classList.remove("hiddenTr")
    });

    tdInput.forEach((input) =>{
        if(input.value !== "preparing"){
            input.parentElement.parentElement.classList.add("hiddenTr")
        }
    })

}

const updateCancelled = () =>{
    const tdInput = document.querySelectorAll("#hiddenStatus");

    tdInput.forEach((input) =>{
        input.parentElement.parentElement.classList.remove("hiddenTr")
    });

    tdInput.forEach((input) =>{
        if(input.value !== "cancelled"){
            input.parentElement.parentElement.classList.add("hiddenTr")
        }
    })

}

$("document").ready(function (){
    const createForm = $(".createForm");
    const updateForm = $(".updateForm");

    createForm.validate({
        rules:{
            customerId: {
                required: true
            },
            orderedDate: {
                required: true
            },
            deliveryDate: {
                required: true
            },
            paid: {
                required: true
            },
            status: {
                required: true
            }
        }
    })

    updateForm.validate({
        rules:{
            orderedDate: {
                required: true
            },
            deliveryDate: {
                required: true
            },
            paid: {
                required: true
            },
            status: {
                required: true
            }
        }
    })

    createForm.on("submit", (event) =>{
        event.preventDefault();
        if(createForm.valid()){
            createOrder();
            createForm[0].reset();
        }
    })

    updateForm.on("submit", (event) =>{
        event.preventDefault();
        if(createForm.valid()){
            updateOrder();
            updateForm[0].reset();
        }
    })
});