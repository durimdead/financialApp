import { Injectable } from "@angular/core";
import { AbstractControl } from "@angular/forms";
import { of } from "rxjs";

@Injectable({
	providedIn: 'root'
})
export class FormValidators{
	mustBeNumber(control: AbstractControl){
		if(Number.isNaN(Number(control.value))){
			return of({isNotNumber: true});
		}
		return null;
	}
}