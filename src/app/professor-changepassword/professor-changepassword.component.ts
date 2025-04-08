import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-professor-changepassword',
    templateUrl: './professor-changepassword.component.html',
    styleUrls: ['./professor-changepassword.component.css']
})
export class ProfessorChangepasswordComponent {
    constructor(private servis: AuthService, private router: Router) { }

    kor_ime: String = localStorage.getItem("logged") || '';
    stara_lozinka: String = ""
    nova_lozinka: String = "";
    nova_lozinka2: String = "";
    poruka: String = "";
    uspeh: String = "";

    promeniLozinku() {
        this.kor_ime = localStorage.getItem("logged") || '';

        if (!this.kor_ime) {
            this.poruka = "Korisnik nije prijavljen.";
            setTimeout(() => {
                this.poruka = ""
            }, 2000);
            return;
        }

        if (!this.stara_lozinka || !this.nova_lozinka || !this.nova_lozinka2) {
            this.poruka = "Sva polja moraju biti popunjena.";
            setTimeout(() => {
                this.poruka = ""
            }, 2000);
            return;
        }

        if (this.nova_lozinka !== this.nova_lozinka2) {
            this.poruka = "Lozinke se ne poklapaju.";
            setTimeout(() => {
                this.poruka = ""
            }, 2000);
            return;
        }

        this.servis.promeniLozinku(this.kor_ime, this.stara_lozinka, this.nova_lozinka).subscribe(
            data => {
                if (data === "ok") {
                    this.uspeh = "Uspešno ste promenili lozinku!";
                    setTimeout(() => {
                        this.uspeh = ""
                    }, 2000);
                } else {
                    this.poruka = data;
                    setTimeout(() => {
                        this.poruka = ""
                    }, 2000);
                }
            },
            error => {
                this.poruka = "Došlo je do greške prilikom promene lozinke.";
            }
        );
    }


    logout() {
        localStorage.setItem('logged', '');
        this.router.navigate([""]);
    }

}
