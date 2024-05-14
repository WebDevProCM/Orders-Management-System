const updateProfile = async () =>{
    try{
        showSpinner("#submit-btn", {content: generalSpinner});

        const id = $("#hiddenId").val();
        const url = "/api/admin/" + id;

        let data = new FormData();
        data.append("name", $("#name").val());

        let image = document.querySelector("#file").files;
        if(image.length> 0){
            data.append("image", image[0]);
        }

        const response = await fetch(url, {
            method: "PATCH",
            body: data
        });
        const admin = await response.json();
        if(admin.error){
            return showError(admin.error);
        }

        $(".profile__img img").attr("src", `/images/admin/${admin.image}`);
        $("#name").val(admin.name);
        showSuccess("Profile updated!");

    }catch(error){
        showError("something went wrong!");
    }finally{
        hideSpinner("#submit-btn", {content: "Submit"});
    }
}

$("document").ready(function () {
    const profileForm = $("form");

    profileForm.validate({
        rules: {
            name:{
                required: true
            },
            email:{
                required: true
            }
        }
    })

    profileForm.on("submit", (event) =>{
        event.preventDefault();

        if(profileForm.valid()){
            updateProfile();
        }
    });
});