import {
  AbstractControl,
  FormArray,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';

async function sleep() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 2500);
  });
}

export class FormUtils {
  // Expresiones regulares
  static nameUtils = /^[A-Za-zÁ-Úá-úÜüÑñÇç]+$/;
  static emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  static notOnlySpacesPattern = /^(?!\s*$).+/;

  static getTextError(errors: ValidationErrors): string | null {
    if (!errors) return null;

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es obligatorio';

        case 'minlength':
          return `Debe tener al menos ${errors[key].requiredLength} caracteres (actual: ${errors[key].actualLength})`;

        case 'maxlength':
          return `No puede exceder ${errors[key].requiredLength} caracteres (actual: ${errors[key].actualLength})`;

        case 'min':
          return `El valor mínimo permitido es ${errors[key].min}`;

        case 'max':
          return `El valor máximo permitido es ${errors[key].max}`;

        case 'email':
          return 'Ingrese un correo electrónico válido';

        case 'requiredTrue':
          return 'Debe aceptar los términos y condiciones';

        case 'match':
          return 'Los valores no coinciden';

        case 'whitespace':
          return 'No puede contener solo espacios en blanco';

        case 'invalidDate':
          return 'Fecha no válida';

        case 'invalidPassword':
          return 'La contraseña debe contener al menos una mayúscula, un número y un carácter especial';

        case 'invalidPhone':
          return 'Ingrese un número de teléfono válido';

        case 'pattern':
          if (errors['pattern'].requiredPattern == FormUtils.emailPattern) {
            return 'El valor ingresado no luce como un correo electrónico';
          }
          return 'Error de patrón contra expresión regular';

        case 'emailTaken':
          return 'El correo electrónico está siendo usado por otro usuario';

        case 'noStrider':
          return 'El nombre de usuario esta siendo usado por otro';
        case 'ciTaken':
          return 'La cédula ya está registrada';
        default:
          // Para errores personalizados
          if (typeof errors[key] === 'string') {
            return errors[key];
          }
          return `Error de validación: ${key}`;
      }
    }
    return null;
  }

  static isValidField(form: FormGroup, fieldName: string): boolean | null {
    return (
      !!form.controls[fieldName].errors && form.controls[fieldName].touched
    );
  }

  static getFieldError(form: FormGroup, fieldName: string): string | null {
    if (!form.controls[fieldName]) return null;

    const errors = form.controls[fieldName].errors ?? {};

    return FormUtils.getTextError(errors);
  }

  static isValidFieldInArray(formArray: FormArray, index: number) {
    return (
      formArray.controls[index].errors && formArray.controls[index].touched
    );
  }

  static getFieldErrorInArray(
    formArray: FormArray,
    index: number
  ): string | null {
    if (formArray.controls.length === 0) return null;

    const errors = formArray.controls[index].errors ?? {};

    return FormUtils.getTextError(errors);
  }

  static isFieldOneEqualFieldTwo(field1: string, field2: string) {
    return (FormGroup: AbstractControl) => {
      const field1Value = FormGroup.get(field1)?.value;
      const field2Value = FormGroup.get(field2)?.value;

      return field1Value == field2Value ? null : { fieldsNotEqual: true };
    };
  }

  static async chekingServerResponse(
    control: AbstractControl
  ): Promise<ValidationErrors | null> {
    console.log('Validando contra servidor...');

    await sleep();
    const formValue = control.value;

    if (formValue == 'hola@mundo.com') {
      return {
        emailTaken: true,
      };
    }
    return null;
  }

  static notStrider(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    return value == 'strider' ? { noStrider: true } : null;
  }
}
