import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-modal.component.html',
})
export class ErrorModalComponent {
  @Input() isOpen = false;
  @Input() message = 'Ha ocurrido un error';
  @Input() showConfirmButtons = false;

  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();
}
