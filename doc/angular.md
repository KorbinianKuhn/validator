# AngularValidator

Inherits all types from the default validator.

component.ts

```typescript
import { AngularValidator } from '@korbiniankuhn/validator/dist/bundle.js';

// en-alt is optimized for frontend form errors
const validator = AngularValidator({ language: 'en-alt' });

// Synchronous validation
this.formBuilder.group({
  'name': new FormControl({}, validator.String().min(5).validateSync())
});


// Asynchronous validation
this.formBuilder.group({
  'name': new FormControl({}, null, validator.String().min(5).validatec())
});

```

component.html

```html
<form [formGroup]="myFormGroup">
  <mat-form-field>
    <input matInput 
      placeholder="Name" 
      formControlName="name">
    <mat-error *ngIf="myFormGroup.controls.name.hasError('validation')">
      {{ myFormGroup.controls.name.getError('validation') }}
    </mat-error>
  </mat-form-field>
</form>
```