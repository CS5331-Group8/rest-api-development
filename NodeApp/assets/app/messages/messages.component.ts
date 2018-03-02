import { Component } from "@angular/core";

@Component({
    selector: 'app-messages',
    template: `
		<ul class="nav nav-tabs" role="tablist">
		<li class="active"><a href="#posttab" role="tab" data-toggle="tab">Post New Diary</a></li>
		<li><a href="#pubtab" role="tab" data-toggle="tab">Public Diary</a></li>
		
		</ul>
		
		<div class="tab-content">
			<div class="tab-pane active" id="posttab">
			<h2> Compose new diary entry</h2>
				<div class="row">
				<app-message-input></app-message-input>
				</div>
			</div>
			<div class="tab-pane" id="pubtab">
			<h2> Public Diary Entries </h2>
				<div class="row">
				<app-message-list></app-message-list>
				</div>
			</div>
		</div>
    `
})
export class MessagesComponent {

}