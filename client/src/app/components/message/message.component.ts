import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  constructor() { }

  @Input() message = 300;
  @Input() width;
  @Output() close = new EventEmitter();

  ngOnInit() {
  }

  onCloseClicked() {
    this.close.emit();
  }

}
