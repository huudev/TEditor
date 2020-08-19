import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ChangeSupportLongSentenceWarning, ChangeSupportLongParagraphWarning } from '@app/safe-editor/action/editor.action';

@UntilDestroy()
@Component({
  selector: 'app-support-control',
  templateUrl: './support-control.component.html',
  styleUrls: ['./support-control.component.scss']
})
export class SupportControlComponent implements OnInit {
  longSentenceWarningControl: FormControl;
  longParagraphWarningControl: FormControl;

  ngOnInit(): void {
    this.longSentenceWarningControl = new FormControl(true);
    this.longSentenceWarningControl.valueChanges.pipe(untilDestroyed(this))
      .subscribe(flag => this.changeSupportLongSentenceWarning(flag))
    this.longParagraphWarningControl = new FormControl(true);
    this.longParagraphWarningControl.valueChanges.pipe(untilDestroyed(this))
      .subscribe(flag => this.changeSupportLongParagraphWarning(flag))
  }

  @Dispatch()
  changeSupportLongSentenceWarning = (flag: boolean) => new ChangeSupportLongSentenceWarning(flag)

  @Dispatch()
  changeSupportLongParagraphWarning = (flag: boolean) => new ChangeSupportLongParagraphWarning(flag)
}
