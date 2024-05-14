const loginUser = async () =>{
    try{
        showSpinner("#submit-btn", {content: generalSpinner});
        const data = {
            email: $("#email").val(),
            password: $("#password").val()
        }

        const response = await fetch("/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        const admin = await response.json();
        if(admin.error){
            return showError(admin.error);
        }
        showSuccess("Logged In!")
        window.location.replace("/orders");
        
    }catch(error){
        showError("Something went wrong!");
    }finally{
        hideSpinner("#submit-btn", {content: "Login In"})
    }
}

$("document").ready( function() {
    const loginForm = $("form");

    loginForm.validate({
        rules: {
            email: {
                required: true
            },
            password: {
                required: true
            }
        }
    });

    loginForm.on("submit", (event) =>{
        event.preventDefault();
        if(loginForm.valid()){
            loginUser();
            loginForm[0].reset();
        }
    })
});