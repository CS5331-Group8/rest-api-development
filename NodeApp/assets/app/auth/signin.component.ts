import { Component } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { User } from "./user.model";
import { AuthService } from "./auth.service";

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html'
})
export class SigninComponent {
    myForm: FormGroup;
    public isWrong :boolean = false;
    constructor(private authService: AuthService, private router: Router) {
        console.log(window.location.host);
    }

    onSubmit() {
        const user = new User(this.myForm.value.username, this.myForm.value.password);
        this.authService.signin(user)
            .subscribe(
                data => {
                    if(data.status == false){
                        console.log("Log in Fai led");
                        this.failedSignIn = true;
                        return;
                    }

                    localStorage.setItem('token', data.token);
                    // localStorage.setItem('userId', data.userId);
                    console.log("asd");
                    this.authService.getInfo().subscribe();
                    this.router.navigateByUrl('/');
                },
                error => console.error(error)
            );

        this.myForm.reset();
    }
    public userNameControl =new FormControl(null, [Validators.required,Validators.minLength(6)]);
    public passWordControl = new FormControl(null, [Validators.required,Validators.minLength(8)]);
    public failedSignIn = false;
    ngOnInit() {
        this.myForm = new FormGroup({
            username: this.userNameControl,
            password: this.passWordControl
        });
    }
}