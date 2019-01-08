import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  validateForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
    name    : [ null, [ Validators.required ] ],
    phone    : [ null, [ Validators.required ] ],
    course    : [ null, [ Validators.required ] ],
    content    : [ null, [ ] ],
  });
  }

}
