let dataTable;
$("document").ready(function (){
    dataTable = $("table").DataTable({
        "ajax":{
            "url": "/api/product" ,
            "dataSrc": ""
        },
        "columns": [
            {"data": "prodId"},
            {"data": function (product){
                return `<img src="/images/products/${product.image}" class="product-img">`
            }, "width": "15%"},
            {"data": "name"},
            {"data": function (product){
                if(product.quantity < 1){
                    return `<p style="color: red">Out of stock</P>`
                }else{
                    return product.quantity
                }
            }},
            {"data": "price"},
            {"data": function (product){
                if(product.status == 1){
                    return `<p style="color: green">Available</P>`
                }else{
                    return `<p style="color: red">Not available</P>`
                }
            }},
            {"data": "category.name"},
            {"data": function (product) {
                return `
                    <button class="btn btn-outline-primary btn-sm" id="update-${product.prodId}" onclick="initiateUpdate('${product.prodId}')"> Update </button>
                    <button class="btn btn-outline-danger btn-sm" id="delete-${product.prodId}" onclick="initiateDelete('${product.prodId}')"> Delete </button>
                `
            }}
        ]
    })

});

const initiateCreate = async () =>{
    const url = "/api/category";
    try{
        const response = await fetch(url);
        const categories = await response.json();
        if(categories.length < 1){
            return showError("Please create a product category!");
        }

        let categoryList = '';
        categories.forEach((category) =>{
            return categoryList = categoryList + `<option value="${category._id}" selected>${category.name}</option>`
        });
        $(".createForm #category").html(categoryList);
        showModal("#createModal");
    }catch(error){
        showError("something went wrong!");
    }
}

const createProduct = async () =>{
    showSpinner("#create-btn", {content: generalSpinner});
    hideModal("#createModal");
    try{
        const url = "/api/product";
        let data = new FormData();
        data.append("name", $(".createForm #name").val());
        data.append("quantity", $(".createForm #quantity").val());
        data.append("price", $(".createForm #price").val());
        data.append("status", $(".createForm #status").val());
        data.append("category", $(".createForm #category").val());

        const image =  document.querySelector(".createForm #image").files;
        if(image.length > 0){
            data.append("image", image[0]);
        }

        const response = await fetch(url,{
            method: "POST",
            body: data
        });
        const product = await response.json();

        if(product.error){
            return showError(product.error);
        }

        dataTable.row.add(product).draw();
        showSuccess("Product created Successfully!");

    }catch(error){
        showError("Something went wrong!");
    }finally{
        hideSpinner("#create-btn", {content: "+ADD"})
    }
}

const initiateUpdate = async (id) =>{
    const productUrl = `/api/product/${id}`;
    const categoryUrl = "/api/category"
    try{
        const response = await fetch(productUrl);
        const product = await response.json();

        if(product.error){
            return showError(category.error);
        }

        $(".updateForm #name").val(product.name);
        $(".updateForm #quantity").val(product.quantity);
        $(".updateForm #price").val(product.price);
        $(".updateForm #status").val(product.status);
        $(".updateForm #category").val(product.category._id);
        $(".updateForm #hiddenId").val(id);

        const res = await fetch(categoryUrl);
        const categories = await res.json();
        if(categories.length < 1){
            return showError("Please create a product category!");
        }

        let categoryList = '';
        categories.forEach((category) =>{
            if(category._id === product.category._id){
                return categoryList = categoryList + `<option value="${category._id}" selected>${category.name}</option>`
            }else{
                return categoryList = categoryList + `<option value="${category._id}">${category.name}</option>`
            }
        });
        $(".updateForm #category").html(categoryList);

        showModal("#updateModal");

    }catch(error){
        showError("Something went wrong!");
    }
}

const updateProduct = async () =>{
    const id = $(".updateForm #hiddenId").val();
    const url = `/api/product/${id}`;
    try{
        showSpinner(`#update-${id}`, {content: generalSpinner});
        hideModal("#updateModal");
        
        let data = new FormData();
        data.append("name", $(".updateForm #name").val());
        data.append("quantity", $(".updateForm #quantity").val());
        data.append("price", $(".updateForm #price").val());
        data.append("status", $(".updateForm #status").val());
        data.append("category", $(".updateForm #category").val());

        const image =  document.querySelector(".updateForm #image").files;
        if(image.length > 0){
            data.append("image", image[0]);
        }
    
        const response = await fetch(url, {
            method: "PATCH",
            body: data
        });

        const product = await response.json();

        if(product.error){
            return showError(product.error);
        }

        const rowIndex = (document.querySelector(`#update-${id}`).parentElement.parentElement.rowIndex) - 1;
        dataTable.row(rowIndex).data(product).draw();
        showSuccess("Product updated!");

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
              deleteProduct(id);
            } else {
              swal("Your Data is safe!");
            }
          });
}

const deleteProduct = async (id) =>{
    const url = `/api/product/${id}`;
    try{
        showSpinner(`#delete-${id}`, {content: generalSpinner});

        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });
        const product = await response.json();

        if(product.error){
            return showError(product.error);
        }

        const rowIndex = (document.querySelector(`#delete-${id}`).parentElement.parentElement.rowIndex) - 1;
        dataTable.row(rowIndex).remove().draw();
        showSuccess("Product removed!");

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
            quantity: {
                required: true,
                min: 0
            },
            price: {
                required: true,
                min: 0
            },
            status: {
                required: true
            },
            category: {
                required: true
            }
        }
    })

    updateForm.validate({
        rules:{
            name: {
                required: true
            },
            quantity: {
                required: true,
                min: 0
            },
            price: {
                required: true,
                min: 0
            },
            status: {
                required: true
            },
            category: {
                required: true
            }
        }
    })

    createForm.on("submit", (event) =>{
        event.preventDefault();
        if(createForm.valid()){
            createProduct();
            createForm[0].reset();
        }
    })

    updateForm.on("submit", (event) =>{
        event.preventDefault();
        if(createForm.valid()){
            updateProduct();
            updateForm[0].reset();
        }
    })
});