import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { AuthService } from "./auth.service";
import { User } from "./user.model";

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html'
})
export class SignupComponent implements OnInit {
    myForm: FormGroup;

    constructor(private authService: AuthService) {
        console.log("started");
    }

    onSubmit() {
        console.log("cdcacsdjnajk");
        console.log("alods lol");
        const user = new User(
            this.myForm.value.username,
            this.myForm.value.password,
            this.myForm.value.fullname,
            this.myForm.value.age
        );
        this.authService.signup(user)
            .subscribe(
                data => console.log(data),
                error => console.error(error)
            );
        this.myForm.reset();
    }

    public nameControl =new FormControl(null, [Validators.required,Validators.pattern("[a-zA-z ][a-zA-Z ]+")]);
    public ageControl = new FormControl(null, [Validators.required,Validators.min(6),Validators.max(150), Validators.pattern("[0-9]*")]);
    public userNameControl =new FormControl(null, [Validators.required,Validators.minLength(6)]);
    public passWordControl = new FormControl(null, [Validators.required,Validators.minLength(8)]);
    ngOnInit() {
        this.myForm = new FormGroup({
            fullname: this.nameControl,
            age: this.ageControl,
            username: this.userNameControl,
            password: this.passWordControl
        });
    }
}