let dataTable;
$("document").ready(function (){
    dataTable = $("table").DataTable({
        "ajax":{
            "url": "/api/category" ,
            "dataSrc": ""
        },
        "columns": [
            {"data": "name"},
            {"data": function (category) {
                return `
                    <button class="btn btn-outline-primary btn-sm" id="update-${category._id}" onclick="initiateUpdate('${category._id}')"> Update </button>
                    <button class="btn btn-outline-danger btn-sm" id="delete-${category._id}" onclick="initiateDelete('${category._id}')"> Delete </button>
                `
            }}
        ]
    })

});

const createCategory = async () =>{
    showSpinner("#create-btn", {content: generalSpinner});
    hideModal("#createModal");
    try{
        const url = "/api/category";
        let data = {
            name: $(".createForm #name").val()
        }

        const response = await fetch(url,{
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        const category = await response.json();

        if(category.error){
            return showError(category.error);
        }

        dataTable.row.add(category).draw();
        showSuccess("Category created Successfully!");

    }catch(error){
        showError("Something went wrong!");
    }finally{
        hideSpinner("#create-btn", {content: "+ADD"})
    }
}

const initiateUpdate = async (id) =>{
    const url = `/api/category/${id}`;
    try{
        const response = await fetch(url);
        const category = await response.json();

        if(category.error){
            return showError(category.error);
        }

        $(".updateForm #name").val(category.name);
        $(".updateForm #hiddenId").val(id);

        showModal("#updateModal");

    }catch(error){
        showError("Something went wrong!");
    }
}

const updateCategory = async () =>{
    const id = $(".updateForm #hiddenId").val();
    const url = `/api/category/${id}`;
    try{
        showSpinner(`#update-${id}`, {content: generalSpinner});
        hideModal("#updateModal");
        
        const data = {
            name: $(".updateForm #name").val()
        }
    
        const response = await fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const category = await response.json();

        if(category.error){
            return showError(category.error);
        }

        const rowIndex = (document.querySelector(`#update-${id}`).parentElement.parentElement.rowIndex) - 1;
        dataTable.row(rowIndex).data(category).draw();
        showSuccess("Category updated!");

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
              deleteCategory(id);
            } else {
              swal("Your Data is safe!");
            }
          });
}

const deleteCategory = async (id) =>{
    const url = `/api/category/${id}`;
    try{
        showSpinner(`#delete-${id}`, {content: generalSpinner});

        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });
        const category = await response.json();

        if(category.error){
            return showError(category.error);
        }

        const rowIndex = (document.querySelector(`#delete-${id}`).parentElement.parentElement.rowIndex) - 1;
        dataTable.row(rowIndex).remove().draw();
        showSuccess("Category removed!");

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
            }
        }
    })

    updateForm.validate({
        rules:{
            name: {
                required: true
            }
        }
    })

    createForm.on("submit", (event) =>{
        event.preventDefault();
        if(createForm.valid()){
            createCategory();
            createForm[0].reset();
        }
    })

    updateForm.on("submit", (event) =>{
        event.preventDefault();
        if(createForm.valid()){
            updateCategory();
            updateForm[0].reset();
        }
    })
});