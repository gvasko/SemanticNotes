import { ConfirmationType } from "./confirmation-type";

export class ConfirmationData {
  public title: string = "";
  public messages: string[] = [""];
  public confirmationType: ConfirmationType = ConfirmationType.YesNoCancel;
  public mainAction: (() => void) | null = null;
  public secondaryAction: (() => void) | null = null;
  public cancelAction: (() => void) | null = null;

  static CreateYesNoCancelData(title: string, messages: string[], mainAction: () => void): ConfirmationData {
    let data = new ConfirmationData();
    data.title = title;
    data.messages = messages;
    data.mainAction = mainAction;
    data.confirmationType = ConfirmationType.YesNoCancel;
    return data;
  }

  static CreateYesNoData(title: string, messages: string[], mainAction: () => void): ConfirmationData {
    let data = new ConfirmationData();
    data.title = title;
    data.messages = messages;
    data.mainAction = mainAction;
    data.confirmationType = ConfirmationType.YesNo;
    return data;
  }
}
