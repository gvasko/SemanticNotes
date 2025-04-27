import { Component, Inject, OnInit } from '@angular/core';
import { ConfirmationType } from './confirmation-type';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationData } from './confirmation-data';

@Component({
  selector: 'lantor-confirmation-dialog',
  standalone: false,
  
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss'
})
export class ConfirmationDialogComponent implements OnInit {

  public mainButtonLabel: string = "Main";
  public secondaryButtonLabel: string = "Secondary";
  public cancelButtonLabel: string = "Cancel";

  constructor(@Inject(MAT_DIALOG_DATA) private data: ConfirmationData) {

  }

  ngOnInit() {
    switch (this.data.confirmationType) {
      case ConfirmationType.YesNo:
      case ConfirmationType.YesNoCancel: {
        this.mainButtonLabel = "Yes";
        this.secondaryButtonLabel = "No";
        this.cancelButtonLabel = "Cancel";
        break;
      }
    }
  }

  get title(): string {
    return this.data.title;
  }

  get messages(): string[] {
    return this.data.messages;
  }

  onClickMainButton() {
    console.log("main-button clicked");
    if (this.data.mainAction !== null) {
      this.data.mainAction();
    }
  }

  onClickSecondaryButton() {
    console.log("secondary-button clicked");
    if (this.data.secondaryAction !== null) {
      this.data.secondaryAction();
    }
  }

  onClickCancelButton() {
    console.log("cancel-button clicked");
    if (this.data.cancelAction !== null) {
      this.data.cancelAction();
    }
  }

  onClickCrossButton() {
    console.log("cross-button clicked");
    if (this.data.cancelAction !== null) {
      this.data.cancelAction();
    }
  }

  cancelButtonAllowed(): boolean {
    return this.data.confirmationType === ConfirmationType.YesNoCancel;
  }

}
