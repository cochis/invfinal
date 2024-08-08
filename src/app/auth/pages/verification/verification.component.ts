import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css']
})
export class VerificationComponent  {

  email!: string
  token!: string
  loading = false
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private functionsService: FunctionsService
  ) {
    this.email = this.route.snapshot.params['email']
    this.token = this.route.snapshot.params['email']

    this.authService.verificationEmail(this.email,this.token).subscribe((resp: any) => {
      setTimeout(() => {
        this.functionsService.clearLocal()
        this.functionsService.navigateTo('auth/login')
      }, 2500);
    })

  }
}
